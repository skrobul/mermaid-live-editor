import { toBase64 } from 'js-base64';

describe('Site Loads', () => {
	beforeEach(() => {
		cy.clearLocalStorage();
	});
	it('Check Home page load', () => {
		cy.visit('/');
		cy.url().should('include', '/edit');
		cy.contains('History').click();
		cy.getLocalStorage('codeStore').snapshot();
	});

	it('Check Redirect from old URL', () => {
		cy.visit(
			'/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW0NocmlzdG1hc10gLS0-fEdldCBtb25leXwgQihHbyBzaG9wcGluZylcbiAgICBCIC0tPiBDe0xldCBtZSB0aGlua31cbiAgICBDIC0tPnxPbmV8IERbTGFwdG9wXVxuICAgIEMgLS0-fFR3b3wgRVtpUGhvbmVdXG4gICAgQyAtLT58VGhyZWV8IEZbZmE6ZmEtY2FyIENhcl0iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ'
		);
		cy.url().should(
			'include',
			'/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBBW0NocmlzdG1hc10gLS0-fEdldCBtb25leXwgQihHbyBzaG9wcGluZylcbiAgICBCIC0tPiBDe0xldCBtZSB0aGlua31cbiAgICBDIC0tPnxPbmV8IERbTGFwdG9wXVxuICAgIEMgLS0-fFR3b3wgRVtpUGhvbmVdXG4gICAgQyAtLT58VGhyZWV8IEZbZmE6ZmEtY2FyIENhcl0iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ'
		);
		cy.contains('History').click();
		cy.getLocalStorage('codeStore').snapshot();
	});

	it('should load sample diagrams when clicked', () => {
		cy.contains('Sample Diagrams').click();
		cy.contains('Pie Chart').click();
		cy.contains('pie title Pets adopted by volunteers');
		cy.contains('Class Diagram').click();
		cy.contains('classDiagram');
	});

	it('should load diagram from gist', () => {
		cy.visit(`/edit?gist=https://gist.github.com/sidharthv96/6268a23e673a533dcb198f241fd7012a`);
		cy.contains('History').click();
		cy.contains('Go shopping!!');
		cy.contains('Revisions');
		cy.contains('sidharthv96 v8f8f1e2');
		cy.contains('sidharthv96 v7851e19');
		cy.getLocalStorage('codeStore').snapshot();
	});

	it('should load diagram from gist revision', () => {
		cy.visit(
			'/edit?gist=https://gist.github.com/sidharthv96/6268a23e673a533dcb198f241fd7012a/ec9b4ab0e41e4ff6287326cd3cb47affd7851e19'
		);
		cy.contains('History').click();
		cy.contains('Party');
		cy.contains('Revisions');
		cy.contains('sidharthv96 v7851e19');
		cy.getLocalStorage('codeStore').snapshot();
	});

	it('should load diagram from raw files', () => {
		cy.visit(
			'/edit?code=https://gist.githubusercontent.com/sidharthv96/6268a23e673a533dcb198f241fd7012a/raw/4eb03887e6a41397e80bdcdbf94017c498f8f1e2/code.mmd&config=https://gist.githubusercontent.com/sidharthv96/6268a23e673a533dcb198f241fd7012a/raw/4eb03887e6a41397e80bdcdbf94017c498f8f1e2/config.json'
		);
		cy.contains('Party');
		cy.getLocalStorage('codeStore').snapshot();
	});

	// Disabled temporarily. Should be enabled after the issue is fixed in Mermaid.
	// it('should prevent setting the "securityLevel" option via URL', () => {
	// 	const b64State = toBase64(
	// 		`{"code":"graph TD\\nA[\\"<img src='https://via.placeholder.com/64' width=64 />\\"]","mermaid":"{\\"securityLevel\\": \\"loose\\", \\"theme\\": \\"forest\\"}","updateEditor":true,"autoSync":true,"updateDiagram":true}`,
	// 		true
	// 	);
	// 	cy.on('window:confirm', () => true);
	// 	cy.visit(`/edit#${b64State}`);
	// 	cy.contains('Config').click();
	// 	cy.contains('forest');
	// 	cy.contains('securityLevel').should('not.exist');
	// 	cy.get('#view').find('img').should('not.exist');
	// 	cy.get('#view').contains('<img');
	// 	cy.get('#view').contains(`src='https://via.placeholder.com/64'`);
	// });

	it('should allow persisting "securityLevel" using confirm dialogue', () => {
		const b64State = toBase64(
			`{"code":"graph TD\\nA[\\"<img src='https://via.placeholder.com/64' width=64/>\\"]","mermaid":"{\\"securityLevel\\": \\"loose\\", \\"theme\\": \\"forest\\"}","updateEditor":true,"autoSync":true,"updateDiagram":true}`,
			true
		);
		cy.on('window:confirm', () => false);
		cy.visit(`/edit#${b64State}`);
		cy.contains('Config').click();
		cy.contains('forest');
		cy.contains('securityLevel');
		cy.get('#view').find('img').should('be.visible');
	});

	it('should show troubleshooting steps if loading fails', () => {
		cy.visit('/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAg');
		cy.contains('Please Click here to Raise an issue in github.');
	});
});
