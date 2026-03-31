import https from 'https';

const ICONS_MAP = {
  partnership: 'handshake',
  people: 'users',
  data: 'database',
  system: 'network',
  playbooks: 'book-open',
  training: 'graduation-cap',
  sales: 'target',
  production: 'hammer',
  marketing: 'megaphone',
  automation: 'zap',
  finance: 'wallet',
  intelligence: 'bar-chart-2',
  aiAgents: 'bot',
  procurement: 'shopping-cart',
  eso: 'award',
  exitReady: 'door-open',
  robotics: 'cpu',
  growth: 'trending-up',
  ipo: 'landmark',
};

const fetchIcon = (name) => {
  return new Promise((resolve, reject) => {
    https
      .get(`https://unpkg.com/lucide-static@0.344.0/icons/${name}.svg`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
};

async function buildIconsTs() {
  let tsCode = `export const icons = {\n`;

  for (const [key, name] of Object.entries(ICONS_MAP)) {
    try {
      const svg = await fetchIcon(name);
      const innerHtmlMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (innerHtmlMatch) {
        let innerHtml = innerHtmlMatch[1]
          .trim()
          .replace(/class=/g, 'className')
          .replace(/stroke-width=/g, 'strokeWidth')
          .replace(/stroke-linecap=/g, 'strokeLinecap')
          .replace(/stroke-linejoin=/g, 'strokeLinejoin');

        tsCode += `  ${key}: \`${innerHtml}\`,\n`;
      }
    } catch (e) {
      console.error('Failed to fetch', name, e);
    }
  }

  tsCode += '} as const;\n';
  console.log(tsCode);
}

buildIconsTs();
