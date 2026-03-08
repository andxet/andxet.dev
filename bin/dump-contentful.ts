/**
 * Dumps all Contentful data (including drafts) to contentful-backup.json.
 * Uses DRAFT_INCLUDED_ACCESS_TOKEN (Preview API) to include unpublished entries.
 *
 * Run with: yarn dump
 */

import * as fs from 'fs';
import * as https from 'https';

const SPACE_ID = process.env.SPACE_ID;
const ACCESS_TOKEN = process.env.DRAFT_INCLUDED_ACCESS_TOKEN;
const PREVIEW_HOST = 'preview.contentful.com';

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('Missing SPACE_ID or DRAFT_INCLUDED_ACCESS_TOKEN in .env');
  process.exit(1);
}

function get(path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const url = `https://${PREVIEW_HOST}${path}&access_token=${ACCESS_TOKEN}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

type ContentfulItem = {
  sys: { id: string; contentType?: { sys: { id: string } }; publishedAt?: string };
  fields: Record<string, unknown>;
};

type ContentfulResponse = {
  total: number;
  items: ContentfulItem[];
};

type Asset = {
  sys: { id: string };
  fields: { title?: string; file?: { url?: string } };
};

type AssetResponse = {
  total: number;
  items: Asset[];
};

async function main() {
  console.log('Fetching Contentful data (including drafts)...');

  const [entriesRaw, assetsRaw] = await Promise.all([
    get(`/spaces/${SPACE_ID}/entries?limit=1000`) as Promise<ContentfulResponse>,
    get(`/spaces/${SPACE_ID}/assets?limit=1000`) as Promise<AssetResponse>,
  ]);

  const assetMap: Record<string, string> = {};
  for (const a of assetsRaw.items) {
    const url = a.fields.file?.url;
    if (url) assetMap[a.sys.id] = 'https:' + url;
  }

  const backup = {
    about: {} as Record<string, unknown>,
    socialLinks: [] as unknown[],
    projects: [] as unknown[],
  };

  for (const item of entriesRaw.items) {
    const ct = item.sys.contentType?.sys.id;
    const f = item.fields;

    if (ct === 'about') {
      const profileRef = f.profile as { sys?: { id?: string } } | undefined;
      backup.about = {
        name: f.name,
        roles: f.roles,
        aboutMe: f.aboutMe,
        mediumUser: f.mediumUser,
        profile: assetMap[profileRef?.sys?.id ?? ''] ?? '',
      };
    } else if (ct === 'socialLink') {
      backup.socialLinks.push({
        name: f.name,
        url: f.url,
        icon: f.fontAwesomeIcon,
        published: !!item.sys['publishedAt'],
      });
    } else if (ct === 'project') {
      const logoRef = f.logo as { sys?: { id?: string } } | undefined;
      backup.projects.push({
        name: f.name,
        type: f.type,
        date: f.publishedDate,
        description: f.description,
        repositoryUrl: f.repositoryUrl,
        projectUrl: f.projectUrl,
        logo: assetMap[logoRef?.sys?.id ?? ''] ?? '',
        published: !!item.sys['publishedAt'],
      });
    }
  }

  (backup.projects as Array<{ date?: string }>).sort((a, b) =>
    (b.date ?? '').localeCompare(a.date ?? '')
  );

  fs.writeFileSync('contentful-backup.json', JSON.stringify(backup, null, 2));
  console.log(
    `Saved: ${(backup.projects as unknown[]).length} projects, ` +
    `${backup.socialLinks.length} social links`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
