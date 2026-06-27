const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.resolve(__dirname, '..', '.env');
const backupPath = envPath + '.bak';

function question(q) {
  return new Promise(resolve => rl.question(q, ans => resolve(ans)));
}

async function main() {
  console.log('This helper will create/update your .env with a MongoDB connection string.');
  console.log('If you already have a .env, it will be backed up to .env.bak');

  const useFull = (await question('Do you want to paste the full Atlas connection string? (y/N): ')).trim().toLowerCase();

  let finalLine;

  if (useFull === 'y' || useFull === 'yes') {
    const conn = (await question('Paste the full connection string (mongodb+srv://...): ')).trim();
    if (!conn.startsWith('mongodb')) {
      console.error('The connection string should start with mongodb. Aborting.');
      process.exit(1);
    }
    finalLine = `MONGODB_URL=${conn}`;
  } else {
    const user = (await question('Mongo DB user (e.g. student): ')).trim();
    const pass = (await question('Mongo DB password (will not be shown): '));
    const host = (await question('Mongo host (e.g. studynotioncluster.8zteiyk.mongodb.net): ')).trim();
    const db = (await question('Database name (default: admin): ')).trim() || 'admin';
    const opts = (await question('Options (default: retryWrites=true&w=majority): ')).trim() || 'retryWrites=true&w=majority';

    const encoded = encodeURIComponent(pass);
    const url = `mongodb+srv://${user}:${encoded}@${host}/${db}?${opts}`;
    finalLine = `MONGODB_URL=${url}`;
  }

  rl.close();

  // backup existing .env if present
  try {
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, backupPath);
      console.log('.env backed up to .env.bak');
    }

    // Read existing .env lines (preserve other values)
    let lines = [];
    if (fs.existsSync(envPath)) {
      lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      // remove old MONGODB_URL line if present
      lines = lines.filter(l => !l.startsWith('MONGODB_URL='));
    }

    lines.push(finalLine);
    fs.writeFileSync(envPath, lines.join('\n'));
    console.log('Updated .env with MONGODB_URL.');
    console.log('Now run: node test.js');
  } catch (err) {
    console.error('Failed to write .env:', err);
    process.exit(1);
  }
}

main();
