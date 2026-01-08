/**
 * Validates required environment variables
 * @param requiredVars - Array of required environment variable names
 * @param options - Configuration options
 * @returns Object with isValid flag and missing variables array
 */
export interface EnvValidationOptions {
  exitOnMissing?: boolean;
  logMissing?: boolean;
}

export interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export const validateEnv = (
  requiredVars: string[],
  options: EnvValidationOptions = {}
): EnvValidationResult => {
  const {
    exitOnMissing = false,
    logMissing = true,
  } = options;

  const missing: string[] = [];
  const warnings: string[] = [];

  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    
    if (!value || value.trim() === '') {
      missing.push(varName);
      if (logMissing) {
        console.error(`❌ Missing required environment variable: ${varName}`);
      }
    }
  });

  const isValid = missing.length === 0;

  if (!isValid && logMissing) {
    console.error(`\n⚠️  Missing ${missing.length} required environment variable(s):`);
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file or environment.\n');
  }

  if (warnings.length > 0 && logMissing) {
    console.warn('\n⚠️  Environment variable warnings:');
    warnings.forEach((warning) => {
      console.warn(`   - ${warning}`);
    });
    console.warn('');
  }

  if (!isValid && exitOnMissing) {
    console.error('❌ Application cannot start without required environment variables.');
    process.exit(1);
  }

  return {
    isValid,
    missing,
    warnings,
  };
};

/**
 * Gets and validates required environment variables
 * @param varName - Environment variable name
 * @param defaultValue - Default value if not set (optional)
 * @param required - Whether the variable is required
 * @returns The environment variable value or default
 */
export const getEnvVar = (
  varName: string,
  defaultValue?: string,
  required: boolean = false
): string => {
  const value = process.env[varName];

  if (required && (!value || value.trim() === '')) {
    console.error(`❌ Required environment variable ${varName} is not set`);
    throw new Error(`Required environment variable ${varName} is missing`);
  }

  if (!value || value.trim() === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (required) {
      throw new Error(`Required environment variable ${varName} is missing`);
    }
    return '';
  }

  return value;
};

/**
 * Validates all required environment variables for the application
 * Database variables are REQUIRED and must be set
 */
export const validateAppEnv = (): EnvValidationResult => {
  // Required database variables (must be set)
  const requiredVars = [
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
  ];

  const warnings: string[] = [];

  console.log('🔍 Validating environment variables...\n');

  // Check NODE_ENV (optional, defaults to development)
  if (!process.env.NODE_ENV) {
    warnings.push('NODE_ENV not set, defaulting to "development"');
  }

  // Check PORT (optional, has default)
  if (!process.env.PORT) {
    warnings.push('PORT not set, defaulting to 3000');
  }

  const result = validateEnv(requiredVars, {
    exitOnMissing: true,
    logMissing: true,
  });

  // Add warnings
  result.warnings = warnings;

  if (warnings.length > 0) {
    console.warn('⚠️  Optional environment variable warnings:');
    warnings.forEach((warning) => {
      console.warn(`   - ${warning}`);
    });
    console.warn('');
  }

  if (result.isValid) {
    console.log('✅ All required environment variables are set.\n');
  }

  return result;
};
