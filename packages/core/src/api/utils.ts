/**
 * Utility functions for Codeforces data processing
 * Alpha 0.1 - Analysis and filtering features
 */

import type {
  Problem,
  Submission,
  User,
  FilterOptions,
  UserStatistics,
  ProblemStatistic
} from '../types';

/**
 * Filter problems based on various criteria
 */
export function filterProblems(
  problems: Problem[],
  statistics: ProblemStatistic[],
  options: FilterOptions
): Problem[] {
  // Create a map for quick statistics lookup
  const statsMap = new Map<string, ProblemStatistic>();
  for (const stat of statistics) {
    const key = `${stat.contestId}-${stat.index}`;
    statsMap.set(key, stat);
  }

  return problems.filter((problem) => {
    // Filter by rating
    if (options.minRating && (!problem.rating || problem.rating < options.minRating)) {
      return false;
    }
    if (options.maxRating && (!problem.rating || problem.rating > options.maxRating)) {
      return false;
    }

    // Filter by tags (include)
    if (options.tags && options.tags.length > 0) {
      const hasAllTags = options.tags.every((tag) =>
        problem.tags.some((pTag) => pTag.toLowerCase() === tag.toLowerCase())
      );
      if (!hasAllTags) {
        return false;
      }
    }

    // Filter by tags (exclude)
    if (options.excludeTags && options.excludeTags.length > 0) {
      const hasExcludedTag = options.excludeTags.some((tag) =>
        problem.tags.some((pTag) => pTag.toLowerCase() === tag.toLowerCase())
      );
      if (hasExcludedTag) {
        return false;
      }
    }

    // Filter by solved count
    const key = `${problem.contestId}-${problem.index}`;
    const stat = statsMap.get(key);
    if (stat) {
      if (options.minSolvedCount && stat.solvedCount < options.minSolvedCount) {
        return false;
      }
      if (options.maxSolvedCount && stat.solvedCount > options.maxSolvedCount) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Analyze user statistics from submissions
 */
export function analyzeUserStatistics(
  submissions: Submission[],
  user: User
): UserStatistics {
  // Track solved problems
  const solvedProblems = new Set<string>();
  const attemptedProblems = new Set<string>();
  const ratingDistribution: Record<number, number> = {};
  const tagDistribution: Record<string, number> = {};
  const languageCounts: Record<string, number> = {};

  // Calculate 30 days ago timestamp
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
  let recentActivity = 0;

  for (const submission of submissions) {
    const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
    attemptedProblems.add(problemKey);

    // Count recent activity
    if (submission.creationTimeSeconds > thirtyDaysAgo) {
      recentActivity++;
    }

    // Track solved problems (AC verdict)
    if (submission.verdict === 'OK') {
      solvedProblems.add(problemKey);

      // Rating distribution (only for solved problems)
      if (submission.problem.rating) {
        const rating = submission.problem.rating;
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      }

      // Tag distribution (only for solved problems)
      for (const tag of submission.problem.tags) {
        tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
      }
    }

    // Language statistics
    const lang = submission.programmingLanguage;
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  }

  // Find favorite language
  let favoriteLanguage = 'Unknown';
  let maxCount = 0;
  for (const [lang, count] of Object.entries(languageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteLanguage = lang;
    }
  }

  // Calculate acceptance rate
  const acceptanceRate =
    attemptedProblems.size > 0
      ? (solvedProblems.size / attemptedProblems.size) * 100
      : 0;

  return {
    handle: user.handle,
    solvedCount: solvedProblems.size,
    attemptedCount: attemptedProblems.size,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    byRating: ratingDistribution,
    byTags: tagDistribution,
    favoriteLanguage,
    recentActivity
  };
}

/**
 * Recommend problems for a user based on their rating and history
 */
export function recommendProblems(
  problems: Problem[],
  user: User,
  solvedProblems: Set<string>,
  count: number = 10
): Problem[] {
  const userRating = user.rating || 800;
  const targetMin = userRating;
  const targetMax = userRating + 300;

  // Filter problems within target rating range and not solved
  const candidates = problems.filter((problem) => {
    const key = `${problem.contestId}-${problem.index}`;
    if (solvedProblems.has(key)) {
      return false;
    }

    if (!problem.rating) {
      return false;
    }

    return problem.rating >= targetMin && problem.rating <= targetMax;
  });

  // Sort by rating (ascending) and return top N
  candidates.sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return ratingA - ratingB;
  });

  return candidates.slice(0, count);
}

/**
 * Get tag strength analysis from user statistics
 */
export function analyzeTagStrength(
  submissions: Submission[]
): {
  strongTags: string[];
  weakTags: string[];
  tagAccuracy: Record<string, { solved: number; attempted: number; accuracy: number }>;
} {
  const tagStats: Record<
    string,
    { solved: number; attempted: number }
  > = {};

  // Collect tag statistics
  for (const submission of submissions) {
    for (const tag of submission.problem.tags) {
      if (!tagStats[tag]) {
        tagStats[tag] = { solved: 0, attempted: 0 };
      }

      tagStats[tag].attempted++;

      if (submission.verdict === 'OK') {
        tagStats[tag].solved++;
      }
    }
  }

  // Calculate accuracy for each tag
  const tagAccuracy: Record<
    string,
    { solved: number; attempted: number; accuracy: number }
  > = {};

  const tagList: Array<{ tag: string; accuracy: number }> = [];

  for (const [tag, stats] of Object.entries(tagStats)) {
    const accuracy =
      stats.attempted > 0 ? (stats.solved / stats.attempted) * 100 : 0;

    tagAccuracy[tag] = {
      solved: stats.solved,
      attempted: stats.attempted,
      accuracy: Math.round(accuracy * 100) / 100
    };

    // Only consider tags with at least 5 attempts
    if (stats.attempted >= 5) {
      tagList.push({ tag, accuracy });
    }
  }

  // Sort by accuracy
  tagList.sort((a, b) => b.accuracy - a.accuracy);

  // Get top 5 strong and weak tags
  const strongTags = tagList.slice(0, 5).map((item) => item.tag);
  const weakTags = tagList.slice(-5).reverse().map((item) => item.tag);

  return {
    strongTags,
    weakTags,
    tagAccuracy
  };
}

/**
 * Get problem difficulty distribution
 */
export function getProblemDifficultyDistribution(
  problems: Problem[]
): Record<string, number> {
  const distribution: Record<string, number> = {
    '<800': 0,
    '800-1199': 0,
    '1200-1599': 0,
    '1600-1999': 0,
    '2000-2399': 0,
    '2400-2799': 0,
    '2800+': 0,
    'Unrated': 0
  };

  for (const problem of problems) {
    if (!problem.rating) {
      distribution['Unrated']++;
      continue;
    }

    const rating = problem.rating;
    if (rating < 800) {
      distribution['<800']++;
    } else if (rating < 1200) {
      distribution['800-1199']++;
    } else if (rating < 1600) {
      distribution['1200-1599']++;
    } else if (rating < 2000) {
      distribution['1600-1999']++;
    } else if (rating < 2400) {
      distribution['2000-2399']++;
    } else if (rating < 2800) {
      distribution['2400-2799']++;
    } else {
      distribution['2800+']++;
    }
  }

  return distribution;
}
