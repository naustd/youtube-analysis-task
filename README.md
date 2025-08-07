# YouTube Transcription Service

A service that downloads YouTube videos, transcribes them with ElevenLabs, and analyzes the content with GPTZero.

## Features

- Takes screenshot of YouTube video
- Downloads and converts audio to WAV format
- Transcribes audio with ElevenLabs Scribe (word-level timestamps, speaker diarization)
- Analyzes each sentence with GPTZero for AI probability
- Stores results with unique IDs for retrieval

## Setup

1. Clone the repository
2. Create `.env` file based on `.env.example`
3. Install dependencies: `npm install`
4. Start the service: `npm start`

## Docker Setup

```bash
docker-compose up -d
```
