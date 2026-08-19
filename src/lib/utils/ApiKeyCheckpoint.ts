import fs from 'fs';
import path from 'path';
import readline from 'readline';

/**
 * Well-known API key providers and their signup URLs.
 * Used to auto-detect where users should go to get their keys.
 */
const KNOWN_API_PROVIDERS: Record<string, { name: string; signupUrl: string }> = {
  'GROQ': { name: 'Groq', signupUrl: 'https://console.groq.com/keys' },
  'GOOGLE': { name: 'Google Cloud', signupUrl: 'https://console.cloud.google.com/apis/credentials' },
  'OPENAI': { name: 'OpenAI', signupUrl: 'https://platform.openai.com/api-keys' },
  'ANTHROPIC': { name: 'Anthropic', signupUrl: 'https://console.anthropic.com/settings/keys' },
  'STRIPE': { name: 'Stripe', signupUrl: 'https://dashboard.stripe.com/apikeys' },
  'FIREBASE': { name: 'Firebase', signupUrl: 'https://console.firebase.google.com/' },
  'SUPABASE': { name: 'Supabase', signupUrl: 'https://supabase.com/dashboard' },
  'VERCEL': { name: 'Vercel', signupUrl: 'https://vercel.com/account/tokens' },
  'GITHUB': { name: 'GitHub', signupUrl: 'https://github.com/settings/tokens' },
  'TWILIO': { name: 'Twilio', signupUrl: 'https://console.twilio.com/' },
  'SENDGRID': { name: 'SendGrid', signupUrl: 'https://app.sendgrid.com/settings/api_keys' },
  'MAPBOX': { name: 'Mapbox', signupUrl: 'https://account.mapbox.com/access-tokens/' },
  'MAPS': { name: 'Google Maps', signupUrl: 'https://console.cloud.google.com/google/maps-apis' },
  'COHERE': { name: 'Cohere', signupUrl: 'https://dashboard.cohere.com/api-keys' },
  'REPLICATE': { name: 'Replicate', signupUrl: 'https://replicate.com/account/api-tokens' },
  'HUGGING': { name: 'Hugging Face', signupUrl: 'https://huggingface.co/settings/tokens' },
  'PINECONE': { name: 'Pinecone', signupUrl: 'https://app.pinecone.io/' },
  'MEDO': { name: 'MeDo (Baidu)', signupUrl: 'https://medo.dev/' },
  'BAIDU': { name: 'Baidu', signupUrl: 'https://medo.dev/' },
  'MONGODB': { name: 'MongoDB Atlas', signupUrl: 'https://cloud.mongodb.com/' },
  'AWS': { name: 'Amazon Web Services', signupUrl: 'https://aws.amazon.com/console/' },
  'AZURE': { name: 'Microsoft Azure', signupUrl: 'https://portal.azure.com/' },
  'CLOUDFLARE': { name: 'Cloudflare', signupUrl: 'https://dash.cloudflare.com/profile/api-tokens' },
};

interface ApiKeyInfo {
  envVarName: string;
  providerName: string;
  signupUrl: string;
  isFilled: boolean;
}

export class ApiKeyCheckpoint {
  /**
   * Reads the .env.example file, identifies required keys, checks if they're
   * already configured, and if not, pauses the pipeline with instructions.
   * 
   * Returns true if all keys are filled, false if the user skipped.
   */
  async checkpoint(projectDir: string, hackathonUrls?: string[]): Promise<boolean> {
    const envExamplePath = path.join(projectDir, '.env.example');
    const envPath = path.join(projectDir, '.env');

    // Check if .env.example exists
    if (!fs.existsSync(envExamplePath)) {
      console.log('     ℹ️  No .env.example found — no API keys required.');
      return true;
    }

    // Copy .env.example to .env if .env doesn't exist yet
    if (!fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
    }

    // Parse the keys from .env.example
    const requiredKeys = this.parseEnvFile(envExamplePath);
    
    if (requiredKeys.length === 0) {
      return true;
    }

    // Check which keys are already filled in .env
    const currentEnv = this.parseEnvValues(envPath);
    const keyInfos: ApiKeyInfo[] = requiredKeys.map(key => {
      const matchedProvider = this.matchProvider(key);
      const currentValue = currentEnv[key] || '';
      const isFilled = currentValue.length > 0 && 
                       !currentValue.includes('your_') && 
                       !currentValue.includes('_here') &&
                       !currentValue.includes('placeholder');

      return {
        envVarName: key,
        providerName: matchedProvider?.name || this.humanizeKeyName(key),
        signupUrl: matchedProvider?.signupUrl || '',
        isFilled,
      };
    });

    // If all keys are already filled, skip the checkpoint
    const missingKeys = keyInfos.filter(k => !k.isFilled);
    if (missingKeys.length === 0) {
      console.log('     ✅ All API keys are already configured!');
      return true;
    }

    // Display the checkpoint
    console.log('');
    console.log('  ┌─────────────────────────────────────────────────────┐');
    console.log('  │  🔑 API KEY CHECKPOINT                              │');
    console.log('  └─────────────────────────────────────────────────────┘');
    console.log('');
    console.log('  Your project requires the following API keys:');
    console.log('');

    keyInfos.forEach((key, idx) => {
      const status = key.isFilled ? '✅' : '❌';
      console.log(`   ${status} ${idx + 1}. ${key.envVarName}`);
      console.log(`      Provider: ${key.providerName}`);
      if (key.signupUrl) {
        console.log(`      Sign up:  ${key.signupUrl}`);
      }
      console.log('');
    });

    // Show any hackathon-specific signup URLs
    if (hackathonUrls && hackathonUrls.length > 0) {
      console.log('  📋 Hackathon-specific links:');
      hackathonUrls.forEach(url => {
        console.log(`     → ${url}`);
      });
      console.log('');
    }

    console.log(`  📝 Edit your API keys in: ${envPath}`);
    console.log('');
    console.log('  ─────────────────────────────────────────────────────');

    // Wait for user input
    const answer = await this.prompt(
      '  Press ENTER when your keys are configured (or type "skip" to continue without keys): '
    );

    if (answer.trim().toLowerCase() === 'skip') {
      console.log('  ⚠️  Skipping API key configuration. Some features may not work.');
      console.log('');
      return false;
    }

    // Re-read .env to verify keys were filled
    const updatedEnv = this.parseEnvValues(envPath);
    const stillMissing = missingKeys.filter(k => {
      const val = updatedEnv[k.envVarName] || '';
      return val.length === 0 || val.includes('your_') || val.includes('_here');
    });

    if (stillMissing.length > 0) {
      console.log(`  ⚠️  ${stillMissing.length} key(s) still appear to be placeholder values:`);
      stillMissing.forEach(k => console.log(`     • ${k.envVarName}`));
      console.log('  Proceeding anyway — you can update them later.');
    } else {
      console.log('  ✅ All API keys verified! Continuing pipeline...');
    }
    console.log('');

    return true;
  }

  /**
   * Parses an .env file and returns the variable names (keys only).
   */
  private parseEnvFile(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys: string[] = [];

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        // Only include actual API keys, skip generic config
        if (key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN') || key.includes('URL')) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  /**
   * Parses an .env file and returns key-value pairs.
   */
  private parseEnvValues(filePath: string): Record<string, string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const values: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        values[key] = value;
      }
    }

    return values;
  }

  /**
   * Matches an environment variable name to a known API provider.
   */
  private matchProvider(envVarName: string): { name: string; signupUrl: string } | null {
    const upper = envVarName.toUpperCase();
    
    for (const [keyword, provider] of Object.entries(KNOWN_API_PROVIDERS)) {
      if (upper.includes(keyword)) {
        return provider;
      }
    }

    return null;
  }

  /**
   * Converts an env var name like MEDO_API_KEY to a human-readable name.
   */
  private humanizeKeyName(envVarName: string): string {
    return envVarName
      .replace(/_API_KEY$/i, '')
      .replace(/_KEY$/i, '')
      .replace(/_SECRET$/i, '')
      .replace(/_TOKEN$/i, '')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Prompts the user for input in the terminal.
   */
  private prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}
