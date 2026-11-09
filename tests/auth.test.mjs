import test from 'node:test';
import assert from 'node:assert/strict';
import {
  saveNewAccount,
  findAccountByEmail,
  verifyAccountPassword,
  setActiveSessionUid,
  getActiveSessionUid,
  clearActiveSession,
} from '../src/utils/authRegistry.ts';

test('Madura Serbaguna Auth Flow - 7 Required User Scenarios', async (t) => {
  const testEmail = `tester_${Date.now()}@gmail.com`;
  const testPass = 'RahasiaMadura2026';
  const wrongPass = 'SalahPassword123';
  const unregisteredEmail = `tidak_terdaftar_${Date.now()}@gmail.com`;

  // Skenario 1: Login dengan Gmail yang belum terdaftar → ditolak
  await t.test('1. Login dengan Gmail yang belum terdaftar → ditolak', async () => {
    const account = findAccountByEmail(unregisteredEmail);
    assert.equal(account, undefined);
    const resultMessage = !account ? 'Akun belum terdaftar. Silakan daftar terlebih dahulu.' : 'OK';
    assert.equal(resultMessage, 'Akun belum terdaftar. Silakan daftar terlebih dahulu.');
  });

  // Skenario 2: Daftar akun baru → berhasil
  let registeredUid = '';
  await t.test('2. Daftar akun baru → berhasil', async () => {
    const newAcc = await saveNewAccount({
      name: 'Budi Santoso',
      email: testEmail,
      phone: '081234567890',
      password: testPass,
      role: 'customer',
    });
    assert.ok(newAcc);
    assert.equal(newAcc.email, testEmail);
    assert.equal(newAcc.name, 'Budi Santoso');
    assert.equal(newAcc.role, 'customer');
    assert.ok(newAcc.uid);
    assert.notEqual(newAcc.passwordHash, testPass); // Password MUST be securely hashed, never plaintext!
    registeredUid = newAcc.uid;
  });

  // Skenario 3: Mendaftar menggunakan Gmail yang sudah terdaftar → ditolak
  await t.test('3. Mendaftar menggunakan Gmail yang sudah terdaftar → ditolak', async () => {
    let duplicateRejected = false;
    let duplicateMsg = '';
    try {
      await saveNewAccount({
        name: 'Kembaran Budi',
        email: testEmail,
        phone: '089999999999',
        password: 'anotherPassword123',
        role: 'customer',
      });
    } catch (err) {
      duplicateRejected = true;
      duplicateMsg = err.message;
    }
    assert.equal(duplicateRejected, true);
    assert.equal(duplicateMsg, 'Alamat Gmail atau email ini sudah pernah terdaftar. Silakan masuk ke akun Anda.');
  });

  // Skenario 4: Login dengan password salah → ditolak
  await t.test('4. Login dengan password salah → ditolak', async () => {
    const account = findAccountByEmail(testEmail);
    assert.ok(account);
    const isPassValid = await verifyAccountPassword(account, wrongPass);
    assert.equal(isPassValid, false);
    const resultMessage = !isPassValid ? 'Password yang kamu masukkan salah.' : 'OK';
    assert.equal(resultMessage, 'Password yang kamu masukkan salah.');
  });

  // Skenario 5: Login dengan akun yang baru didaftarkan → berhasil
  await t.test('5. Login dengan akun yang baru didaftarkan → berhasil', async () => {
    const account = findAccountByEmail(testEmail);
    assert.ok(account);
    const isPassValid = await verifyAccountPassword(account, testPass);
    assert.equal(isPassValid, true);
    setActiveSessionUid(account.uid);
    assert.equal(getActiveSessionUid(), registeredUid);
  });

  // Skenario 6: Logout → kembali ke halaman Login (sesi dihapus)
  await t.test('6. Logout → kembali ke halaman Login', async () => {
    clearActiveSession();
    assert.equal(getActiveSessionUid(), null);
  });

  // Skenario 7: Login kembali dengan akun lama → berhasil
  await t.test('7. Login kembali dengan akun lama → berhasil', async () => {
    const account = findAccountByEmail(testEmail);
    assert.ok(account);
    const isPassValid = await verifyAccountPassword(account, testPass);
    assert.equal(isPassValid, true);
    setActiveSessionUid(account.uid);
    assert.equal(getActiveSessionUid(), registeredUid);
  });
});
