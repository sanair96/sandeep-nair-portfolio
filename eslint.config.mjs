import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const sourceExtensions = '{ts,tsx}'
const topLevelFeatures = ['hero', 'career-evidence', 'leadership', 'personal-projects', 'contact']
const careerStories = ['atlassian', 'amazon', 'spacejoy']
const relativeDepths = ['..', '../..', '../../..', '../../../..', '../../../../..']

const threeImports = [
  {
    name: 'three',
    message: 'Three.js is isolated to the Spacejoy feature.',
  },
  {
    name: '@react-three/fiber',
    message: 'React Three Fiber is isolated to the Spacejoy feature.',
  },
  {
    name: '@react-three/drei',
    message: 'Drei is isolated to the Spacejoy feature.',
  },
]

const directImportPattern = {
  group: ['**/index', '**/index.*'],
  message: 'Import the source module directly instead of a barrel index.',
}

function siblingPatterns(root, siblings, aliasPrefix, relativeParent = '') {
  return siblings
    .filter((sibling) => sibling !== root)
    .flatMap((sibling) => [
      `${aliasPrefix}/${sibling}`,
      `${aliasPrefix}/${sibling}/**`,
      ...relativeDepths.flatMap((depth) => [
        `${depth}/${relativeParent}${sibling}`,
        `${depth}/${relativeParent}${sibling}/**`,
      ]),
    ])
}

function restrictedImports({ patterns = [], allowThree = false } = {}) {
  return [
    'error',
    {
      paths: allowThree ? [] : threeImports,
      patterns: [
        directImportPattern,
        ...(allowThree
          ? []
          : [
              {
                group: ['three/**', '@react-three/fiber/**', '@react-three/drei/**'],
                message: '3D dependencies are isolated to the Spacejoy feature.',
              },
            ]),
        ...patterns,
      ],
    },
  ]
}

const topLevelFeatureBoundaries = topLevelFeatures
  .filter((feature) => feature !== 'career-evidence')
  .map((feature) => ({
    files: [`src/features/${feature}/**/*.${sourceExtensions}`],
    rules: {
      'no-restricted-imports': restrictedImports({
        patterns: [
          {
            group: siblingPatterns(feature, topLevelFeatures, '@/features'),
            message: 'Features cannot import sibling features.',
          },
        ],
      }),
    },
  }))

const careerStoryBoundaries = careerStories.map((story) => ({
  files: [`src/features/career-evidence/${story}/**/*.${sourceExtensions}`],
  rules: {
    'no-restricted-imports': restrictedImports({
      allowThree: story === 'spacejoy',
      patterns: [
        {
          group: siblingPatterns(story, careerStories, '@/features/career-evidence'),
          message: 'Employer story modules cannot import one another.',
        },
      ],
    }),
  },
}))

const sharedBoundaryPatterns = [
  {
    group: [
      '@/features',
      '@/features/**',
      '@/content',
      '@/content/**',
      ...relativeDepths.flatMap((depth) => [
        `${depth}/features`,
        `${depth}/features/**`,
        `${depth}/content`,
        `${depth}/content/**`,
      ]),
    ],
    message: 'Shared modules cannot import features or content.',
  },
]

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: [`src/app/**/*.${sourceExtensions}`, `src/content/**/*.${sourceExtensions}`],
    rules: {
      'no-restricted-imports': restrictedImports(),
    },
  },
  {
    files: [`src/features/career-evidence/*.${sourceExtensions}`],
    rules: {
      'no-restricted-imports': restrictedImports(),
    },
  },
  ...topLevelFeatureBoundaries,
  ...careerStoryBoundaries,
  {
    files: [`src/shared/**/*.${sourceExtensions}`],
    rules: {
      'no-restricted-imports': restrictedImports({
        patterns: sharedBoundaryPatterns,
      }),
    },
  },
  globalIgnores([
    '.next/**',
    'coverage/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
])
