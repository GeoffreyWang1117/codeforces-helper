/**
 * PDF Problem Downloader
 *
 * Handles downloading of PDF-format problems from Codeforces
 * Some older contests or special problems are only available as PDFs
 */

export interface PDFDetectionResult {
  isPDF: boolean;
  pdfUrl?: string;
  error?: string;
}

export interface PDFDownloadResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Detect if a problem is in PDF format
 */
export async function detectPDFProblem(
  contestId: number,
  problemIndex: string
): Promise<PDFDetectionResult> {
  try {
    const url = `https://codeforces.com/contest/${contestId}/problem/${problemIndex}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return {
        isPDF: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();

    // Check for common PDF indicators in Codeforces HTML
    const pdfPatterns = [
      // Direct PDF link
      /href="(\/[^"]*\.pdf)"/i,
      // PDF problem statement link
      /href="(https?:\/\/[^"]*codeforces[^"]*\.pdf)"/i,
      // Statement in PDF format indicator
      /<a[^>]*href="([^"]*)"[^>]*>.*?PDF.*?<\/a>/i,
    ];

    for (const pattern of pdfPatterns) {
      const match = html.match(pattern);
      if (match) {
        let pdfUrl = match[1];

        // Make URL absolute if it's relative
        if (pdfUrl.startsWith('/')) {
          pdfUrl = `https://codeforces.com${pdfUrl}`;
        }

        return {
          isPDF: true,
          pdfUrl,
        };
      }
    }

    // Check if the problem statement div is empty or missing
    // (often indicates PDF-only problem)
    if (html.includes('The problem statement is available in PDF format only')) {
      return {
        isPDF: true,
        error: 'PDF URL not found in HTML, but problem is PDF-only',
      };
    }

    return { isPDF: false };
  } catch (error) {
    return {
      isPDF: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Download PDF file from URL
 */
export async function downloadPDF(
  pdfUrl: string,
  outputPath: string
): Promise<PDFDownloadResult> {
  try {
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // Verify content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('pdf')) {
      return {
        success: false,
        error: `Invalid content type: ${contentType} (expected PDF)`,
      };
    }

    const buffer = await response.arrayBuffer();
    const fileSize = buffer.byteLength;

    // Verify it's actually a PDF by checking magic number
    const uint8 = new Uint8Array(buffer);
    const isPDF =
      uint8.length > 4 &&
      uint8[0] === 0x25 && // %
      uint8[1] === 0x50 && // P
      uint8[2] === 0x44 && // D
      uint8[3] === 0x46;   // F

    if (!isPDF) {
      return {
        success: false,
        error: 'Downloaded file is not a valid PDF',
      };
    }

    // The actual file writing will be handled by the caller
    // since we're in a browser/Node.js agnostic module
    return {
      success: true,
      filePath: outputPath,
      fileSize,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get PDF buffer for saving
 */
export async function fetchPDFBuffer(pdfUrl: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    // Verify PDF magic number
    const uint8 = new Uint8Array(buffer);
    const isPDF =
      uint8.length > 4 &&
      uint8[0] === 0x25 && // %
      uint8[1] === 0x50 && // P
      uint8[2] === 0x44 && // D
      uint8[3] === 0x46;   // F

    if (!isPDF) {
      throw new Error('Downloaded file is not a valid PDF');
    }

    return buffer;
  } catch (error) {
    console.error('Failed to fetch PDF:', error);
    return null;
  }
}

/**
 * Download problem with PDF detection and fallback
 */
export async function downloadProblemWithPDF(
  contestId: number,
  problemIndex: string
): Promise<{
  isPDF: boolean;
  pdfUrl?: string;
  buffer?: ArrayBuffer;
  error?: string;
}> {
  // First detect if it's a PDF problem
  const detection = await detectPDFProblem(contestId, problemIndex);

  if (!detection.isPDF) {
    return { isPDF: false };
  }

  if (!detection.pdfUrl) {
    return {
      isPDF: true,
      error: detection.error || 'PDF URL not found',
    };
  }

  // Download the PDF
  const buffer = await fetchPDFBuffer(detection.pdfUrl);

  if (!buffer) {
    return {
      isPDF: true,
      pdfUrl: detection.pdfUrl,
      error: 'Failed to download PDF',
    };
  }

  return {
    isPDF: true,
    pdfUrl: detection.pdfUrl,
    buffer,
  };
}
