package com.vaultkeep.vaultkeep_backend.util;



import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESUtils {

    // For a production app, this key should be 16, 24, or 32 bytes long
    // and hidden inside your application.properties file.
    // We are keeping it here for demonstration purposes.
    private static final String SECRET_KEY = "MySuperSecretKey123";

    public static String encrypt(String data) throws Exception {
        // Ensure the key is exactly 16 bytes for AES-128
        byte[] keyBytes = SECRET_KEY.substring(0, 16).getBytes();
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");

        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static String decrypt(String encryptedData) throws Exception {
        byte[] keyBytes = SECRET_KEY.substring(0, 16).getBytes();
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");

        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);

        byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(decodedBytes);

        return new String(decryptedBytes);
    }
}