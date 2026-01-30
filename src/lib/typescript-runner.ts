import ts from 'typescript';
import { RunResult, CompileError } from '@/types/lesson';

/**
 * Transpiles TypeScript source code to JavaScript.
 * Returns transpilation result with potential compilation errors.
 */
export function transpileTypeScript(source: string): { code: string; errors: CompileError[] } {
  const errors: CompileError[] = [];

  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.Preserve,
      lib: ['ES2020'],
      strict: true,
    },
  });

  // Handle diagnostic errors
  if (result.diagnostics && result.diagnostics.length > 0) {
    for (const diagnostic of result.diagnostics) {
      if (diagnostic.file && diagnostic.start !== undefined) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        errors.push({
          line: line + 1,
          column: character + 1,
          message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        });
      }
    }
  }

  return { code: result.outputText, errors };
}

/**
 * Executes JavaScript code in a sandboxed iframe.
 * Captures console output and runtime errors.
 * Enforces 5-second timeout.
 */
export async function executeInSandbox(jsCode: string): Promise<{ output: string[]; error?: string }> {
  return new Promise((resolve) => {
    const iframeId = `sandbox-${Date.now()}`;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Setup timeout
    const timeoutId = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({ output: [], error: 'Execution timeout (5s)' });
    }, 5000);

    // Setup message listener
    const listener = (event: MessageEvent) => {
      if (event.data.id === iframeId) {
        clearTimeout(timeoutId);
        window.removeEventListener('message', listener);
        document.body.removeChild(iframe);
        resolve(event.data.result);
      }
    };
    window.addEventListener('message', listener);

    // Inject and execute code
    const sandboxCode = `
      (function() {
        const output = [];
        const console = {
          log: (...args) => {
            output.push(args.map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          }
        };

        try {
          ${jsCode}
          window.parent.postMessage({ id: '${iframeId}', result: { output } }, '*');
        } catch (error) {
          window.parent.postMessage({
            id: '${iframeId}',
            result: { output, error: error instanceof Error ? error.message : String(error) }
          }, '*');
        }
      })();
    `;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`<script>${sandboxCode}</script>`);
      doc.close();
    }
  });
}

/**
 * Main execution function: transpile and run TypeScript code.
 */
export async function runTypeScript(source: string): Promise<RunResult> {
  const startTime = Date.now();

  // Step 1: Transpile
  const { code, errors: compileErrors } = transpileTypeScript(source);

  if (compileErrors.length > 0) {
    return {
      success: false,
      output: [],
      errors: compileErrors,
      duration: Date.now() - startTime,
    };
  }

  // Step 2: Execute
  const { output, error } = await executeInSandbox(code);

  if (error) {
    return {
      success: false,
      output,
      errors: [
        {
          line: 0,
          column: 0,
          message: error,
        },
      ],
      duration: Date.now() - startTime,
    };
  }

  return {
    success: true,
    output,
    errors: [],
    duration: Date.now() - startTime,
  };
}
