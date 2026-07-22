import { sdk } from '../sdk'
import {
  authProfilesJson,
  AuthProfile,
  AuthProfilesFile,
} from '../fileModels/authProfiles.json'
import { openclawJson } from '../fileModels/openclaw.json'
import { i18n } from '../i18n'

const { InputSpec, Value, Variants } = sdk

// --- Auth method variants (shared between primary and fallback) ---

const anthropicAuthVariants = Variants.of({
  'api-key': {
    name: i18n('API Key'),
    spec: InputSpec.of({
      apiKey: Value.text({
        name: i18n('API Key'),
        description: i18n('Your Anthropic API key from console.anthropic.com'),
        required: true,
        default: null,
        masked: true,
        placeholder: 'sk-ant-...',
      }),
    }),
  },
  oauth: {
    name: i18n('OAuth (Claude Pro/Max)'),
    spec: InputSpec.of({
      accessToken: Value.text({
        name: i18n('Access Token'),
        description: i18n(
          'OAuth access token from Claude Pro/Max subscription',
        ),
        required: true,
        default: null,
        masked: true,
      }),
      refreshToken: Value.text({
        name: i18n('Refresh Token'),
        description: i18n('OAuth refresh token (optional)'),
        required: false,
        default: null,
        masked: true,
      }),
    }),
  },
})

const openaiAuthVariants = Variants.of({
  'api-key': {
    name: i18n('API Key'),
    spec: InputSpec.of({
      apiKey: Value.text({
        name: i18n('API Key'),
        description: i18n('Your OpenAI API key from platform.openai.com'),
        required: true,
        default: null,
        masked: true,
        placeholder: 'sk-...',
      }),
    }),
  },
  oauth: {
    name: i18n('OAuth (ChatGPT Plus)'),
    spec: InputSpec.of({
      accessToken: Value.text({
        name: i18n('Access Token'),
        description: i18n('OAuth access token from ChatGPT Plus subscription'),
        required: true,
        default: null,
        masked: true,
      }),
      refreshToken: Value.text({
        name: i18n('Refresh Token'),
        description: i18n('OAuth refresh token (optional)'),
        required: false,
        default: null,
        masked: true,
      }),
    }),
  },
})

const mapleProxyAuthVariants = Variants.of({
  'api-key': {
    name: i18n('API Key'),
    spec: InputSpec.of({
      apiKey: Value.text({
        name: i18n('API Key'),
        description: i18n('Your Maple API key from trymaple.ai'),
        required: true,
        default: null,
        masked: true,
      }),
    }),
  },
})

// --- Model lists ---

const anthropicModels = {
  'claude-opus-4-6': 'Claude Opus 4.6',
  'claude-sonnet-4-6': 'Claude Sonnet 4.6',
  'claude-opus-4-5': 'Claude Opus 4.5',
  'claude-sonnet-4-5': 'Claude Sonnet 4.5',
  'claude-haiku-4-5': 'Claude Haiku 4.5',
}

const openaiModels = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  o3: 'o3',
  'o3-mini': 'o3 Mini',
}

const mapleProxyModels = {
  'gpt-oss-120b': 'GPT OSS 120B',
}

const MAPLE_PROXY_PROVIDER = 'maple-proxy'
const MAPLE_PROXY_BASE_URL = 'http://maple-proxy.startos:8080/v1'

// --- Provider specs (model selector + auth) ---

const anthropicProviderSpec = InputSpec.of({
  model: Value.select({
    name: i18n('Model'),
    description: i18n('Select the Anthropic model to use'),
    default: 'claude-opus-4-6',
    values: anthropicModels,
  }),
  auth: Value.union({
    name: i18n('Authentication'),
    description: i18n('How to authenticate with Anthropic'),
    default: 'api-key',
    variants: anthropicAuthVariants,
  }),
})

const openaiProviderSpec = InputSpec.of({
  model: Value.select({
    name: i18n('Model'),
    description: i18n('Select the OpenAI model to use'),
    default: 'gpt-4o',
    values: openaiModels,
  }),
  auth: Value.union({
    name: i18n('Authentication'),
    description: i18n('How to authenticate with OpenAI'),
    default: 'api-key',
    variants: openaiAuthVariants,
  }),
})

const mapleProxyProviderSpec = InputSpec.of({
  model: Value.select({
    name: i18n('Model'),
    description: i18n('Select the Maple Proxy model to use'),
    default: 'gpt-oss-120b',
    values: mapleProxyModels,
  }),
  auth: Value.union({
    name: i18n('Authentication'),
    description: i18n('How to authenticate with Maple Proxy'),
    default: 'api-key',
    variants: mapleProxyAuthVariants,
  }),
})

// --- Primary LLM (required) ---

const primaryVariants = Variants.of({
  anthropic: {
    name: i18n('Anthropic (Claude)'),
    spec: anthropicProviderSpec,
  },
  openai: {
    name: i18n('OpenAI'),
    spec: openaiProviderSpec,
  },
  'maple-proxy': {
    name: i18n('Maple Proxy'),
    spec: mapleProxyProviderSpec,
  },
})

// --- Fallback LLM (optional) ---

const fallbackVariants = Variants.of({
  disabled: {
    name: i18n('Disabled'),
    spec: InputSpec.of({}),
  },
  anthropic: {
    name: i18n('Anthropic (Claude)'),
    spec: anthropicProviderSpec,
  },
  openai: {
    name: i18n('OpenAI'),
    spec: openaiProviderSpec,
  },
})

// --- Input spec ---

const inputSpec = InputSpec.of({
  primary: Value.union({
    name: i18n('Primary LLM'),
    description: i18n('Select your primary AI model and provider'),
    default: 'anthropic',
    variants: primaryVariants,
  }),
  fallback: Value.union({
    name: i18n('Fallback LLM (Optional)'),
    description: i18n(
      'Select a fallback AI model used when the primary is unavailable (rate limited, auth failure, etc.)',
    ),
    default: 'disabled',
    variants: fallbackVariants,
  }),
})

// --- Helpers ---

function profileToApiKeyPrefill(profile: AuthProfile | undefined) {
  if (profile?.type === 'token') {
    return {
      selection: 'api-key' as const,
      value: { apiKey: profile.token },
    }
  }
  return { selection: 'api-key' as const, value: { apiKey: '' } }
}

function profileToAuthPrefill(profile: AuthProfile | undefined) {
  if (profile?.type === 'token') {
    return {
      selection: 'api-key' as const,
      value: { apiKey: profile.token },
    }
  } else if (profile?.type === 'oauth') {
    return {
      selection: 'oauth' as const,
      value: {
        accessToken: profile.access,
        refreshToken: profile.refresh ?? null,
      },
    }
  }
  return { selection: 'api-key' as const, value: { apiKey: '' } }
}

function authProfileForProvider(
  profiles: Record<string, AuthProfile>,
  provider: string,
): AuthProfile | undefined {
  return profiles[`${provider}:default`] as AuthProfile | undefined
}

function buildProviderPrefill(
  provider: string,
  model: string,
  profile: AuthProfile | undefined,
) {
  if (provider === 'anthropic') {
    return {
      selection: 'anthropic' as const,
      value: {
        model: model as 'claude-opus-4-6',
        auth: profileToAuthPrefill(profile),
      },
    }
  }
  if (provider === 'openai') {
    return {
      selection: 'openai' as const,
      value: {
        model: model as 'gpt-4o',
        auth: profileToAuthPrefill(profile),
      },
    }
  }
  if (provider === 'maple-proxy') {
    return {
      selection: 'maple-proxy' as const,
      value: {
        model: model as 'gpt-oss-120b',
        auth: profileToApiKeyPrefill(profile),
      },
    }
  }
  return {
    selection: 'anthropic' as const,
    value: {
      model: 'claude-opus-4-6' as const,
      auth: profileToAuthPrefill(profile),
    },
  }
}

function parseModelId(modelId: string): { provider: string; model: string } {
  const slashIdx = modelId.indexOf('/')
  if (slashIdx === -1) return { provider: 'anthropic', model: modelId }
  return {
    provider: modelId.slice(0, slashIdx),
    model: modelId.slice(slashIdx + 1),
  }
}

// --- Action ---

export const configureApiCredentials = sdk.Action.withInput(
  'configure-api-credentials',

  async ({ effects }) => ({
    name: i18n('Configure API Credentials'),
    description: i18n(
      'Configure your primary and optional fallback AI model, including provider credentials',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill form with current values
  async ({ effects }) => {
    const authData = (await authProfilesJson
      .read((p) => p)
      .once()) as AuthProfilesFile | null
    const profiles = authData?.profiles ?? {}

    const configData = await openclawJson.read((c) => c).once()
    const primaryModelId =
      configData?.agents?.defaults?.model?.primary ??
      'anthropic/claude-opus-4-6'
    const fallbackModelIds =
      configData?.agents?.defaults?.model?.fallbacks ?? []

    const primary = parseModelId(primaryModelId)
    const anthropicProfile = authProfileForProvider(profiles, 'anthropic')
    const openaiProfile = authProfileForProvider(profiles, 'openai')
    const mapleProxyProfile = authProfileForProvider(profiles, MAPLE_PROXY_PROVIDER)

    const primaryAuth =
      primary.provider === 'anthropic'
        ? anthropicProfile
        : primary.provider === 'openai'
          ? openaiProfile
          : mapleProxyProfile
    const primaryResult = buildProviderPrefill(
      primary.provider,
      primary.model,
      primaryAuth,
    )

    // Pre-fill fallback
    let fallbackResult
    if (fallbackModelIds.length > 0) {
      const fallback = parseModelId(fallbackModelIds[0])
      if (fallback.provider === 'anthropic' || fallback.provider === 'openai') {
        const fallbackAuth =
          fallback.provider === 'anthropic' ? anthropicProfile : openaiProfile
        fallbackResult = buildProviderPrefill(
          fallback.provider,
          fallback.model,
          fallbackAuth,
        )
      } else {
        fallbackResult = { selection: 'disabled' as const, value: {} }
      }
    } else {
      fallbackResult = { selection: 'disabled' as const, value: {} }
    }

    return {
      primary: primaryResult,
      fallback: fallbackResult,
    } as any
  },

  // Save handler
  async ({ effects, input }) => {
    const primaryUnion = input.primary as any
    const fallbackUnion = input.fallback as any

    const primaryProvider: string = primaryUnion.selection
    const primaryModel: string = primaryUnion.value?.model
    const primaryAuth = primaryUnion.value?.auth

    // Extract auth profile from union input
    function extractProfile(provider: string, auth: any): AuthProfile | null {
      if (auth?.selection === 'api-key' && auth.value?.apiKey) {
        return { type: 'token', provider, token: auth.value.apiKey }
      } else if (auth?.selection === 'oauth' && auth.value?.accessToken) {
        return {
          type: 'oauth',
          provider,
          access: auth.value.accessToken,
          refresh: auth.value.refreshToken ?? undefined,
        }
      }
      return null
    }

    const primaryProfile = extractProfile(primaryProvider, primaryAuth)

    const fallbackProvider: string = fallbackUnion.selection
    let fallbackProfile: AuthProfile | null = null
    if (fallbackProvider !== 'disabled') {
      fallbackProfile = extractProfile(
        fallbackProvider,
        fallbackUnion.value?.auth,
      )
    }

    // Read existing profiles and merge
    const authData = (await authProfilesJson
      .read((p) => p)
      .once()) as AuthProfilesFile | null
    const profiles: Record<string, AuthProfile> = {
      ...(authData?.profiles ?? {}),
    }

    // Clear existing default profiles for all providers
    delete profiles['anthropic:default']
    delete profiles['openai:default']
    delete profiles[`${MAPLE_PROXY_PROVIDER}:default`]

    // Set profiles for configured providers
    if (primaryProfile) {
      profiles[`${primaryProvider}:default`] = primaryProfile
    }
    if (fallbackProfile && fallbackProvider !== 'disabled') {
      profiles[`${fallbackProvider}:default`] = fallbackProfile
    }

    await authProfilesJson.write(effects, { profiles })

    // Build model config
    const primary = `${primaryProvider}/${primaryModel}`
    const fallbacks: string[] = []
    if (fallbackProvider !== 'disabled' && fallbackUnion.value?.model) {
      fallbacks.push(`${fallbackProvider}/${fallbackUnion.value.model}`)
    }

    const usesMapleProxy =
      primaryProvider === MAPLE_PROXY_PROVIDER ||
      fallbackProvider === MAPLE_PROXY_PROVIDER

    const existingConfig = await openclawJson.read((c) => c).once()
    const providers = {
      ...(existingConfig?.models?.providers ?? {}),
    }

    if (usesMapleProxy) {
      const mapleApiKey =
        primaryProvider === MAPLE_PROXY_PROVIDER &&
        primaryProfile?.type === 'token'
          ? primaryProfile.token
          : fallbackProvider === MAPLE_PROXY_PROVIDER &&
              fallbackProfile?.type === 'token'
            ? fallbackProfile.token
            : ''
      providers[MAPLE_PROXY_PROVIDER] = {
        baseUrl: MAPLE_PROXY_BASE_URL,
        apiKey: mapleApiKey,
        api: 'openai-completions',
        models: [{ id: 'gpt-oss-120b', name: 'GPT OSS 120B' }],
      }
    } else {
      delete providers[MAPLE_PROXY_PROVIDER]
    }

    const defaultsUpdate: {
      model: { primary: string; fallbacks: string[] }
      models?: Record<string, { alias: string }>
    } = {
      model: { primary, fallbacks },
    }

    if (usesMapleProxy) {
      defaultsUpdate.models = {}
      if (primaryProvider === MAPLE_PROXY_PROVIDER) {
        defaultsUpdate.models[`${MAPLE_PROXY_PROVIDER}/${primaryModel}`] = {
          alias: primaryModel,
        }
      }
      if (
        fallbackProvider === MAPLE_PROXY_PROVIDER &&
        fallbackUnion.value?.model
      ) {
        defaultsUpdate.models[
          `${MAPLE_PROXY_PROVIDER}/${fallbackUnion.value.model}`
        ] = {
          alias: fallbackUnion.value.model,
        }
      }
    }

    await openclawJson.merge(effects, {
      agents: {
        defaults: defaultsUpdate,
      },
      models: {
        mode: 'merge',
        providers,
      },
    })
  },
)
