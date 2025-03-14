async function run() {
    // Generera en krypteringsnyckel
    const key = await generateKey();

    // Kryptera användaruppgifter (exempel: lösenord)
    const { encryptedData, iv } = await encryptData(key, "minSäkraLösenord");

    console.log("Krypterad data:", new Uint8Array(encryptedData));

    // Dekryptera användaruppgifterna
    const decryptedData = await decryptData(key, encryptedData, iv);

    console.log("Dekrypterad data:", decryptedData);
}

run();