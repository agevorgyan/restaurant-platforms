const fs = require('fs');

const policies1 = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain/policies/customer.policies.ts';
let pc1 = fs.readFileSync(policies1, 'utf8');
pc1 = pc1.replace(/customer: any/g, '_customer: any').replace(/customerData: any/g, '_customerData: any');
fs.writeFileSync(policies1, pc1);

const policies2 = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain/policies/loyalty.policies.ts';
let pc2 = fs.readFileSync(policies2, 'utf8');
pc2 = pc2.replace(/loyaltyAccount: any/g, '_loyaltyAccount: any').replace(/loyaltyData: any/g, '_loyaltyData: any');
fs.writeFileSync(policies2, pc2);

const spec1 = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain/specifications/customer.specifications.ts';
let sc1 = fs.readFileSync(spec1, 'utf8');
sc1 = sc1.replace(/customer: any/g, '_customer: any').replace(/customerData: any/g, '_customerData: any');
fs.writeFileSync(spec1, sc1);

const spec2 = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain/specifications/loyalty.specifications.ts';
let sc2 = fs.readFileSync(spec2, 'utf8');
sc2 = sc2.replace(/loyaltyAccount: any/g, '_loyaltyAccount: any').replace(/loyaltyData: any/g, '_loyaltyData: any');
fs.writeFileSync(spec2, sc2);
