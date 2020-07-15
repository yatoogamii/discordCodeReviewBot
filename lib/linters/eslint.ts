import { ESLint } from "eslint";

interface IJavascriptLintResponse {
  errorCount: number;
  warningCount: number;
  errorMessages: IEmbedField[];
  warningMessages: IEmbedField[];
  fixableErrorCount: number;
  fixableWarningCount: number;
}

interface IEmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export const javascriptLint = async (code: string): Promise<IJavascriptLintResponse> => {
  const eslint = new ESLint({ overrideConfigFile: "config/javascript/eslintrc.json" });

  const [codeLinted] = await eslint.lintText(code);

  return {
    errorCount: codeLinted.errorCount,
    warningCount: codeLinted.warningCount,
    errorMessages: codeLinted.messages
      .filter(value => value.severity === 2)
      .map(value => ({ name: `Ligne : ${value.line}\nColumn: ${value.column}`, value: value.message, inline: true })),
    warningMessages: codeLinted.messages
      .filter(value => value.severity === 1)
      .map(value => ({ name: `Ligne : ${value.line}\nColumn: ${value.column}`, value: value.message, inline: true })),
    fixableErrorCount: codeLinted.fixableErrorCount,
    fixableWarningCount: codeLinted.fixableWarningCount,
  };
};
