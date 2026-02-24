// Shared helpers for server-action files.
// Do not add "use server" here because this module exports non-action utilities.

export type ActionResult<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

type ApiResult = ActionResult<any> | null | undefined;

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim().length > 0) return error.trim();
  return fallback;
};

export const mapApiResult = (
  result: ApiResult,
  options: {
    errorMessage: string;
    successMessage?: string;
  },
): ActionResult<any> => {
  if (!result || !result.success) {
    return {
      success: false,
      message: result?.message || options.errorMessage,
    };
  }

  const mapped: ActionResult<any> = {
    success: true,
  };

  if (options.successMessage) {
    mapped.message = options.successMessage;
  } else if (result.message) {
    mapped.message = result.message;
  }

  if (Object.prototype.hasOwnProperty.call(result, "data")) {
    mapped.data = result.data;
  }

  return mapped;
};

export const handleActionError = <T = any>(
  error: unknown,
  fallbackMessage: string,
  logLabel?: string,
): ActionResult<T> => {
  if (logLabel) {
    console.error(`[${logLabel}]`, error);
  }

  return {
    success: false,
    message: getErrorMessage(error, fallbackMessage),
  };
};

export const withActionGuard = async <T>(
  action: () => Promise<ActionResult<T>>,
  options: {
    fallbackMessage: string;
    logLabel?: string;
  },
): Promise<ActionResult<T>> => {
  try {
    return await action();
  } catch (error) {
    return handleActionError<T>(error, options.fallbackMessage, options.logLabel);
  }
};
