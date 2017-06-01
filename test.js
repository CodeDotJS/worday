import childProcess from 'child_process';
import test from 'ava';

test.cb('wordthink', t => {
	const cp = childProcess.spawn('./cli.js', ['-w'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('meriam', t => {
	const cp = childProcess.spawn('./cli.js', ['-m'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});

test.cb('dictionary', t => {
	const cp = childProcess.spawn('./cli.js', ['-d'], {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 0);
		t.end();
	});
});
