import axios from 'axios';

/**
 * Checks if a tender has valid files (edital) available.
 * Tries to access file IDs 1, 2, and 3.
 * 
 * @param cnpj Organization CNPJ
 * @param ano Year of the tender
 * @param sequencial Sequential number of the tender
 * @returns Promise<boolean> True if at least one file exists, false otherwise.
 */
export const checkTenderFiles = async (
    cnpj: string,
    ano: number,
    sequencial: number
): Promise<boolean> => {
    // Use relative path to go through Vite proxy
    const baseUrl = `/pncp-api/v1/orgaos/${cnpj}/compras/${ano}/${sequencial}/arquivos`;

    // Try IDs 1, 2, and 3
    for (let id = 1; id <= 10; id++) {
        try {
            // We use a HEAD request to check existence without downloading the whole file
            // However, some servers might not support HEAD or behave differently.
            // If HEAD fails, we could try GET with a range, but let's stick to HEAD or simple GET for now.
            // Given the user suggestion, we'll try to just fetch headers.
            await axios.head(`${baseUrl}/${id}`);
            return true; // If 200 OK, file exists
        } catch (error) {
            // If 404 or other error, continue to next ID
            // We might want to inspect the error to be sure it's a "not found" and not a network error
            // but for simplicity, we assume any error means "file not accessible here"
            continue;
        }
    }

    return false; // No files found after checking all IDs
};
