const { execSync } = require('child_process');

const envs = {
    "NEXT_PUBLIC_API_URL": "https://backend-production-77fb0.up.railway.app/api",
    "NEXT_PUBLIC_SITE_URL": "https://conexao.ai",
    "NEXT_PUBLIC_SITE_NAME": "Conexao AI",
    "SENTRY_ORG": "conexao-ai-frontend",
    "SENTRY_PROJECT": "conexao-ai-frontend",
    "SENTRY_AUTH_TOKEN": "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",
    "NEXT_PUBLIC_POSTHOG_HOST": "https://app.posthog.com"
};

for (const [key, value] of Object.entries(envs)) {
    console.log(`Adding ${key}...`);
    try {
        // Try to remove first to avoid conflicts if it already exists
        try { execSync(`npx vercel env rm ${key} production preview development -y`, {stdio: 'ignore'}); } catch(e) {}
        
        execSync(`npx vercel env add ${key} production,preview,development`, {
            input: value,
            stdio: ['pipe', 'inherit', 'inherit']
        });
    } catch (e) {
        console.error(`Failed to add ${key}: ` + e.message);
    }
}
