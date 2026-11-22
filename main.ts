/**
 * VELVET CIRCUIT - Tactical Noir Architectural Blueprint Heist Game
 * make.fun Bounty Program Entrypoint (Node.js 22 runtime)
 * Copies the standalone offline game assets and authentic screenshots to /output,
 * validates artifact compliance constraints, and writes the structured dossier.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const VELVET_CIRCUIT_RELEASE = '1.2.1';

function runVelvetCircuitPipeline(): void {
  const baseDir = fileURLToPath(new URL('.', import.meta.url));
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  const gameSourceDir = resolve(baseDir, 'game');
  const shotsSourceDir = resolve(baseDir, 'screenshots');
  const gameDestDir = resolve(outputDir, 'game');
  const shotsDestDir = resolve(outputDir, 'screenshots');
  const dossierPath = resolve(outputDir, 'dossier.json');

  console.log(`[VELVET CIRCUIT v${VELVET_CIRCUIT_RELEASE}] Deploying heist package from ${baseDir} to ${outputDir}...`);

  // Ensure target output root exists
  mkdirSync(outputDir, { recursive: true });

  // 1. Copy standalone HTML5 Canvas game files
  if (!existsSync(gameSourceDir)) {
    throw new Error(`[CRITICAL] Missing game source directory at: ${gameSourceDir}`);
  }
  mkdirSync(gameDestDir, { recursive: true });
  cpSync(gameSourceDir, gameDestDir, { recursive: true });

  // 2. Copy benchmark screenshots
  mkdirSync(shotsDestDir, { recursive: true });
  if (existsSync(shotsSourceDir)) {
    cpSync(shotsSourceDir, shotsDestDir, { recursive: true });
  }

  // Audit screenshot files in destination
  const capturedShots = existsSync(shotsDestDir)
    ? readdirSync(shotsDestDir).filter(name => !name.startsWith('.') && !name.startsWith('-'))
    : [];

  console.log(`[VELVET CIRCUIT] Staged ${capturedShots.length} verified screenshots.`);
  for (const shot of capturedShots) {
    const shotPath = join(shotsDestDir, shot);
    const bytes = statSync(shotPath).size;
    console.log(`  -> ${shot}: ${bytes} bytes (${(bytes / 1024).toFixed(1)} KiB)`);
    if (bytes > 262144) {
      throw new Error(`[COMPLIANCE VIOLATION] Screenshot ${shot} exceeds 256 KiB limit: ${bytes} bytes`);
    }
  }

  // 3. Compile and write official make.fun game dossier
  console.log('[VELVET CIRCUIT] Compiling structural dossier via vendor/makefun-game.ts...');
  const dossierContent = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });

  writeFileSync(dossierPath, dossierContent, 'utf8');
  const dossierBytes = statSync(dossierPath).size;
  console.log(`[VELVET CIRCUIT] Successfully generated dossier.json (${dossierBytes} bytes).`);
  console.log('[VELVET CIRCUIT] Deployment complete. Game ready for evaluation.');
}

runVelvetCircuitPipeline();
