#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliArgs = process.argv.slice(2);

if (cliArgs.length > 0) {
  console.error('Usage: npm run set:version');
  console.error('This command is automatic and does not accept arguments or flags.');
  process.exit(1);
}

const semverRegex = /^\d+\.\d+\.\d+$/;

const bumpType = (commitSubject) => {
  const match = commitSubject.match(/^([a-z]+)(\(.+\))?(!)?:/);
  const isConventional = Boolean(match);
  const type = isConventional ? match[1] : null;
  const hasBang = isConventional && Boolean(match[3]);
  const hasBreakingMarker = /BREAKING CHANGE/.test(commitSubject);

  return {
    type,
    isConventional,
    breaking: hasBang || hasBreakingMarker,
  };
};

const getRootCommit = () =>
  execSync('git rev-list --max-parents=0 HEAD', {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .trim()
    .split(/\s+/)[0];

const getCommitSubjectLog = (baseRef) => {
  const output = execSync(`git log --no-merges --format=%s --reverse ${baseRef}..HEAD`, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

  if (!output) {
    return [];
  }

  return output.split(/\r?\n/);
};

const computeNextVersion = () => {
  const baseRef = getRootCommit();
  const commitSubjects = getCommitSubjectLog(baseRef);
  let major = 0;
  let minor = 0;
  let patch = 0;

  for (const subject of commitSubjects) {
    const message = subject.trim();
    if (!message) {
      continue;
    }

    const { type, isConventional, breaking } = bumpType(message);

    if (!isConventional) {
      continue;
    }

    if (breaking) {
      major += 1;
      minor = 0;
      patch = 0;
      continue;
    }

    switch (type) {
      case 'feat': {
        minor += 1;
        patch = 0;
        break;
      }
      case 'fix':
      case 'perf':
      case 'docs':
      case 'style':
      case 'refactor':
      case 'test':
      case 'chore':
      case 'build':
      case 'ci': {
        patch += 1;
        break;
      }
      default: {
        break;
      }
    }
  }

  return `${major}.${minor}.${patch}`;
};

const writeJson = (filePath, value) => {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const nextVersion = computeNextVersion();
if (!nextVersion || !semverRegex.test(nextVersion)) {
  console.error(`Invalid version '${nextVersion}'. Expected semver x.y.z`);
  process.exit(1);
}

const packageJsonPath = path.join(ROOT_DIR, 'package.json');
const packageLockPath = path.join(ROOT_DIR, 'package-lock.json');
const readmePath = path.join(ROOT_DIR, 'README.md');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
packageJson.version = nextVersion;
writeJson(packageJsonPath, packageJson);

if (existsSync(packageLockPath)) {
  const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
  packageLock.version = nextVersion;

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = nextVersion;
  }

  writeJson(packageLockPath, packageLock);
}

if (existsSync(readmePath)) {
  let readme = readFileSync(readmePath, 'utf8');
  readme = readme.replace(
    /(https:\/\/img\.shields\.io\/badge\/version-)([\d.]+)(-blue\.svg)/,
    `$1${nextVersion}$3`,
  );
  writeFileSync(readmePath, readme);
}

const runGit = (command) => {
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
  } catch (error) {
    console.warn(`[set:version] Failed to run "${command}": ${error?.message ?? error}`);
  }
};

runGit('git add package.json package-lock.json README.md');

const stagedFiles = execSync('git diff --cached --name-only', {
  cwd: ROOT_DIR,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
}).trim();

if (!stagedFiles) {
  console.log(`Version already aligned at ${nextVersion}`);
  process.exit(0);
}

runGit(`git commit -m "build(release): v${nextVersion}"`);
console.log(`Version candidate set to ${nextVersion}`);
