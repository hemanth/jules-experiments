// Hugging Face Hub API Examples in Node.js

// This script will demonstrate:
// 1. Listing models from Hugging Face Hub.
// 2. Getting detailed information for a specific model.
// 3. Downloading a file (e.g., config.json) from a model repository.

// Ensure you have the '@huggingface/hub' library installed:
// npm install @huggingface/hub
// or
// yarn add @huggingface/hub

// Import functions from the library
import { listModels, modelInfo, hfHubDownload } from '@huggingface/hub';
import { promises as fs } from 'fs'; // For file system operations, if saving downloaded files directly
import path from 'path'; // For path operations
import { fileURLToPath } from 'url'; // To handle __dirname in ES modules if needed for local paths

// Helper to ensure a directory exists
async function ensureDirExists(dirPath) {
    try {
        await fs.access(dirPath);
    } catch (e) {
        if (e.code === 'ENOENT') {
            await fs.mkdir(dirPath, { recursive: true });
        } else {
            throw e;
        }
    }
}

async function listTopModelsNode(limit = 10) {
    console.log(`Fetching top \${limit} models from Hugging Face Hub (Node.js)...`);
    try {
        // listModels returns an async iterable
        let count = 0;
        console.log(`  Top models (by downloads, up to \${limit}):`);
        for await (const model of listModels({ sort: 'downloads', direction: -1, limit })) {
            if (count >= limit) break; // Enforce limit manually if needed, though limit option should work
            console.log(`    \${count + 1}. ID: \${model.id}, Author: \${model.author}, Downloads: \${model.downloads?.toLocaleString()}`);
            count++;
        }
        if (count === 0) {
            console.log('  No models found or an issue occurred.');
        }
    } catch (error) {
        console.error(`  Error listing models (Node.js): \${error.message}`);
    }
}

async function getModelDetailsNode(modelId = "gpt2") {
    console.log(`Fetching details for model: \${modelId} (Node.js)...`);
    try {
        const info = await modelInfo(modelId); // modelId can be string or {name: string}
        if (!info) {
            console.log(`  Could not retrieve info for model: \${modelId}`);
            return;
        }
        console.log(`  Details for model: \${info.id}`);
        console.log(`    Author: \${info.author}`);
        console.log(`    Downloads: \${info.downloads?.toLocaleString()}`);
        console.log(`    Likes: \${info.likes?.toLocaleString()}`);
        console.log(`    Last Modified: \${info.lastModified}`);
        console.log(`    Tags: \${info.tags?.join(', ')}`);
        // The JS library's modelInfo might not directly return card data like Python's.
        // It returns ModelData. We might need another call or different handling for README/card.
        // For now, we'll display what's directly available.
        // To get the README content, one might use downloadFile for 'README.md'
        console.log(`    (Model card/README content would require a separate download if not in basic info)`);
    } catch (error) {
        console.error(`  Error fetching model details for \${modelId} (Node.js): \${error.message}`);
    }
}

async function downloadModelConfigFileNode(modelId = "gpt2", filename = "config.json", localDir = "downloaded_files_node") {
    console.log(`Downloading '\${filename}' for model '\${modelId}' to '\${localDir}/' (Node.js)...`);
    try {
        // Ensure the local directory exists using the helper
        await ensureDirExists(localDir);

        // hfHubDownload fetches the file and returns a Blob
        const blob = await hfHubDownload({ repo: modelId, path: filename });

        if (!blob) {
            console.log(`  Failed to download \${filename} for model \${modelId}. Blob is null.`);
            return;
        }

        // Convert Blob to Buffer to save it (Node.js specific)
        const buffer = Buffer.from(await blob.arrayBuffer());

        const localFilePath = path.join(localDir, filename.split('/').pop() || 'downloaded_file'); // Get filename from path
        await fs.writeFile(localFilePath, buffer);

        console.log(`  Successfully downloaded '\${filename}' to '\${localFilePath}'`);

        // Optionally, display a preview of the downloaded file (if text-based)
        if (['.json', '.txt', '.md', '.py', '.js', '.ts', '.rb'].some(ext => filename.endsWith(ext))) {
            try {
                const contentPreview = buffer.toString('utf-8', 0, 200); // Preview first 200 bytes as UTF-8
                console.log(`    Preview of \${filename}:\n      \${contentPreview.replace(/\n/g, '\n      ')}...`);
            } catch (e_read) {
                console.log(`    Could not read preview of \${filename} (may not be text): \${e_read.message}`);
            }
        }
    } catch (error) {
        console.error(`  Error downloading file '\${filename}' for model '\${modelId}' (Node.js): \${error.message}`);
        if (error.cause) { // The JS library often wraps errors
           console.error(`    Cause: \${error.cause}`);
        }
    }
}

async function main() {
    console.log("Hugging Face API Examples (Node.js)");
    console.log("------------------------------------");

    await listTopModelsNode(5);
    console.log("\n------------------------------------\n");
    await getModelDetailsNode("bert-base-uncased");
    console.log("\n------------------------------------\n");
    await downloadModelConfigFileNode("distilbert-base-uncased", "config.json", "hf_distilbert_config_node");

    console.log("\nAll example functions implemented and called.");
}

main().catch(console.error);
