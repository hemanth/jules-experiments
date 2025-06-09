// Hugging Face Hub API Examples in Deno

// This script will demonstrate:
// 1. Listing models from Hugging Face Hub using REST API.
// 2. Getting detailed information for a specific model using REST API.
// 3. Downloading a file (e.g., config.json) from a model repository using REST API.

import { ensureDir } from 'https://deno.land/std@0.224.0/fs/ensure_dir.ts';
import { join } from 'https://deno.land/std@0.224.0/path/mod.ts';

const HF_API_BASE_URL = 'https://huggingface.co/api';

// Helper function to make GET requests
async function httpGet(uri: string): Promise<any> {
    try {
        const response = await fetch(uri, {
            method: 'GET',
            // headers: { 'Authorization': 'Bearer YOUR_HF_TOKEN' } // If needed
        });
        if (!response.ok) {
            console.error(`HTTP error for \${uri}: \${response.status} \${response.statusText}`);
            const errorBody = await response.text();
            console.error(`Error body: \${errorBody}`);
            return null;
        }
        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        }
        return await response.text(); // Or handle as blob/arrayBuffer for downloads
    } catch (error) {
        console.error(`Network or other error for \${uri}:`, error);
        return null;
    }
}

async function listTopModelsDeno(limit = 10): Promise<void> {
    console.log(`Fetching top \${limit} models from Hugging Face Hub (Deno)...`);
    const apiUrl = `\${HF_API_BASE_URL}/models?sort=downloads&direction=-1&limit=\${limit}`;
    const modelsData = await httpGet(apiUrl);
    if (modelsData && Array.isArray(modelsData)) {
        console.log(`  Top \${modelsData.length} models (by downloads):`);
        modelsData.forEach((model: any, i: number) => {
            const modelIdVal = model.id || model.modelId || 'N/A';
            const authorVal = model.author || 'N/A';
            const downloadsVal = model.downloads?.toLocaleString() || 'N/A';
            console.log(`    \${i + 1}. ID: \${modelIdVal}, Author: \${authorVal}, Downloads: \${downloadsVal}`);
        });
    } else if (modelsData) {
        console.log(`  Could not fetch models, received:`, modelsData);
    } else {
        console.log('  No models found or an error occurred during the API call.');
    }
}

async function getModelDetailsDeno(modelId = "gpt2"): Promise<void> {
    console.log(`Fetching details for model: \${modelId} (Deno)...`);
    const modelIdUriSafe = encodeURIComponent(modelId); // Ensure model_id is safe for URI
    const apiUrl = `\${HF_API_BASE_URL}/models/\${modelIdUriSafe}`;
    const info = await httpGet(apiUrl);
    if (info && typeof info === 'object' && info !== null && !Array.isArray(info)) {
        console.log(`  Details for model: \${info.modelId || info.id || modelId}`);
        console.log(`    Author: \${info.author || 'N/A'}`);
        console.log(`    Downloads: \${info.downloads?.toLocaleString() || 'N/A'}`);
        console.log(`    Likes: \${info.likes?.toLocaleString() || 'N/A'}`);
        console.log(`    Last Modified: \${info.lastModified || 'N/A'}`);
        const tags = Array.isArray(info.tags) ? info.tags.join(', ') : (info.tags || 'N/A');
        console.log(`    Tags: \${tags}`);
        console.log(`    (Model card/README content would require a separate download, e.g., of README.md)`);
    } else if (info) {
        console.log(`  Could not retrieve valid details for \${modelId}, received:`, info);
    } else {
        console.log(`  Error fetching model details for \${modelId} or no data returned.`);
    }
}

async function downloadModelConfigFileDeno(modelId = "gpt2", filename = "config.json", localDir = "downloaded_files_deno"): Promise<void> {
    console.log(`Downloading '\${filename}' for model '\${modelId}' to '\${localDir}/' (Deno)...`);
    try {
        const modelIdSafe = encodeURIComponent(modelId);
        const filenameSafe = encodeURIComponent(filename);

        const fileUrl = `https://huggingface.co/\${modelIdSafe}/resolve/main/\${filenameSafe}`;
        console.log(`  Attempting to download from: \${fileUrl}`);

        const response = await fetch(fileUrl, { redirect: 'follow' });

        if (!response.ok) {
            console.error(`  Error downloading file: \${response.status} \${response.statusText}`);
            const errorBody = await response.text();
            console.error(`    Error body: \${errorBody.substring(0, 200)}...`);
            return;
        }

        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();

        await ensureDir(localDir); // ensureDir is imported from Deno's std/fs module
        const localFilename = filename.split('/').pop() || 'downloaded_hf_file_deno';
        const localFilePath = join(localDir, localFilename); // join is imported from Deno's std/path

        await Deno.writeFile(localFilePath, new Uint8Array(buffer));
        console.log(`  Successfully downloaded '\${filename}' to '\${localFilePath}'`);

        if (['.json', '.txt', '.md', '.py', '.js', '.ts', '.rb'].some(ext => filename.toLowerCase().endsWith(ext))) {
            try {
                const textDecoder = new TextDecoder('utf-8');
                const contentPreview = textDecoder.decode(buffer.slice(0, 200));
                console.log(`    Preview of \${localFilename}:\n      \${contentPreview.replace(/\n/g, '\n      ')}...`);
            } catch (eRead) {
                console.log(`    Could not read preview of \${localFilename} (may not be text): \${eRead.message}`);
            }
        }
    } catch (error) {
        console.error(`  Error during download for '\${filename}' of model '\${modelId}' (Deno):`, error);
    }
}

if (import.meta.main) {
    console.log("Hugging Face API Examples (Deno)");
    console.log("------------------------------------");

    await listTopModelsDeno(5);
    console.log("\n------------------------------------\n");
    await getModelDetailsDeno("bert-base-uncased");
    console.log("\n------------------------------------\n");
    await downloadModelConfigFileDeno("distilbert-base-uncased", "config.json", "hf_distilbert_config_deno");

    console.log("\nAll example functions implemented and called.");
}
