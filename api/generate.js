/**
 * Serverless API Endpoint: Generate Puzzle
 * Compatible with Vercel / Render / Node HTTP Server
 * Request: POST or GET
 * Response: Maia / Make.com Endpoint Contract
 */
'use strict';

const { generateDailyPuzzle, ALL_CATEGORIES } = require('../scripts/generate-puzzle');

module.exports = async function handler(req, res) {
  // Enable CORS for Make.com / Webhooks
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const query = req.query || {};

    const excludeCategory = body.excludeCategory || query.excludeCategory || null;
    const excludePuzzleIds = body.excludePuzzleIds || (query.excludePuzzleIds ? query.excludePuzzleIds.split(',') : []);
    const preferredCategory = body.category || query.category || null;

    const result = generateDailyPuzzle({
      excludeCategory,
      excludePuzzleIds,
      preferredCategory
    });

    // Remove imageBuffer from JSON response (as required by contract)
    const { imageBuffer, ...jsonResponse } = result;

    return res.status(200).json(jsonResponse);

  } catch (err) {
    console.error('Serverless generate error:', err);
    return res.status(422).json({
      error: 'Unprocessable Entity',
      message: err.message,
      answerVerified: false
    });
  }
};
