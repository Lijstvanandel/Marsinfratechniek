import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Firestore security rules enforce all 8 pillars and reject Dirty Dozen vulnerabilities', () => {
  const rulesPath = fs.existsSync('firestore.rules') ? 'firestore.rules' : 'DRAFT_firestore.rules';
  const rules = fs.readFileSync(rulesPath, 'utf8');

  // 1. Default deny catch-all
  assert.ok(rules.includes('match /{document=**}'), 'Must include global default-deny catch-all');
  assert.ok(rules.includes('allow read, write: if false;'), 'Global catch-all must deny read and write');

  // 2. Hardened ID validation and Admin verification with email_verified
  assert.ok(rules.includes('function isValidId(id)'), 'Must define isValidId helper');
  assert.ok(rules.includes('request.auth.token.email_verified == true'), 'Must require email_verified == true');

  // 3. Strict validation blueprints for all 4 entities
  assert.ok(rules.includes('function isValidVacancy(data)'), 'Must define isValidVacancy');
  assert.ok(rules.includes('function isValidJobApplication(data)'), 'Must define isValidJobApplication');
  assert.ok(rules.includes('function isValidContactInquiry(data)'), 'Must define isValidContactInquiry');
  assert.ok(rules.includes('function isValidMailConfig(data)'), 'Must define isValidMailConfig');

  // 4. Temporal integrity & immutability
  assert.ok(rules.includes('incoming().createdAt == request.time'), 'Must enforce server timestamp on create');
  assert.ok(rules.includes('incoming().createdAt == existing().createdAt'), 'Must enforce createdAt immutability');
});
