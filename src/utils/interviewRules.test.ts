import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHireDecision,
  calculatePacingMetrics,
  computeAggregatedScore,
  evaluateStarCoverage,
  formatSeconds,
  generatePracticeRoadmap,
} from './interviewRules';

test('computeHireDecision assigns correct calibration bands', () => {
  assert.equal(computeHireDecision(95), 'Strong Hire');
  assert.equal(computeHireDecision(88), 'Strong Hire');
  assert.equal(computeHireDecision(87), 'Lean Hire');
  assert.equal(computeHireDecision(72), 'Lean Hire');
  assert.equal(computeHireDecision(71), 'Lean No Hire');
  assert.equal(computeHireDecision(58), 'Lean No Hire');
  assert.equal(computeHireDecision(57), 'No Hire');
  assert.equal(computeHireDecision(30), 'No Hire');
});

test('calculatePacingMetrics detects word count, wpm, and filler words', () => {
  const answer = 'At my previous company, um, we basically migrated the legacy monolith to microservices, and you know, it reduced latency significantly.';
  const metrics = calculatePacingMetrics(answer, 60); // 60 seconds = 1 minute

  assert.ok(metrics.wordCount > 15);
  assert.equal(metrics.wpm, metrics.wordCount);
  assert.ok(metrics.fillerWordCount >= 3, `Expected at least 3 fillers, found ${metrics.fillerWordCount}`);
  assert.ok(metrics.fillerWordsFound.includes('um'));
  assert.ok(metrics.fillerWordsFound.includes('basically'));
  assert.ok(metrics.fillerWordsFound.includes('you know'));
  assert.equal(metrics.pacingQuality, 'Too Slow'); // word count ~20 in 60s < 90 wpm
});

test('computeAggregatedScore correctly weights dimensions', () => {
  const dimensions = [
    { score: 90, weight: 2 },
    { score: 70, weight: 1 },
  ];
  // (90 * 2 + 70 * 1) / 3 = 250 / 3 = 83.33 -> 83
  assert.equal(computeAggregatedScore(dimensions), 83);
});

test('evaluateStarCoverage flags missing components and detects present ones', () => {
  const structuredAnswer = 'In my role as lead engineer, my goal was to reduce query timeouts. I designed an index clustering strategy. As a result, query latency improved by 40% in production.';
  const res = evaluateStarCoverage(structuredAnswer);

  assert.equal(res.score, 100);
  assert.equal(res.missingComponents.length, 0);
  assert.equal(res.situation, true);
  assert.equal(res.task, true);
  assert.equal(res.action, true);
  assert.equal(res.result, true);
});

test('formatSeconds formats minutes and seconds with zero padding', () => {
  assert.equal(formatSeconds(0), '00:00');
  assert.equal(formatSeconds(65), '01:05');
  assert.equal(formatSeconds(3599), '59:59');
});

test('generatePracticeRoadmap returns actionable recommendations', () => {
  const roadmap = generatePracticeRoadmap(['STAR Methodology', 'System Architecture']);
  assert.equal(roadmap.length, 2);
  assert.ok(roadmap[0].includes('STAR behavioral drills'));
  assert.ok(roadmap[1].includes('System Architecture') || roadmap[1].includes('latency'));
});
