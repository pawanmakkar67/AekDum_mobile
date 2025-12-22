// Stream Service
// Abstracts the underlying streaming provider (Agora, IVS, Mux, etc.)
// and manages stream state and synchronization

import { STREAMING_CONFIG } from '../config/shopify.config';
import { socketClient } from './socketClient';
import type {
    StreamConfig,
    StreamState,
    StreamStatus,
    StreamProvider,
} from '../types/streaming.types';

class StreamService {
    private provider: StreamProvider;
    private currentStream: StreamState | null = null;
    private isBroadcasting: boolean = false;

    constructor() {
        this.provider = STREAMING_CONFIG.provider as StreamProvider;
    }

    // Initialize the streaming engine (e.g., Agora engine)
    async initialize(): Promise<void> {
        console.log(`Initializing StreamService with provider: ${this.provider}`);
        // In a real app, you would initialize the SDK here
        // e.g., AgoraRtcEngine.create(appId)
    }

    // Start a broadcast
    async startBroadcast(title: string, config?: Partial<StreamConfig>): Promise<StreamState> {
        try {
            console.log('Starting broadcast:', title);
            this.isBroadcasting = true;

            // 1. Create stream record on backend (mocked here)
            const streamId = `stream-${Date.now()}`;

            this.currentStream = {
                id: streamId,
                status: 'live',
                title,
                hostId: 'current-user', // Replace with real user ID
                hostName: 'You',
                viewerCount: 0,
                startedAt: new Date().toISOString(),
                chatEnabled: true,
                recordingEnabled: true,
                playbackUrl: this.getPlaybackUrl(streamId),
            };

            // 2. Notify socket server
            socketClient.startStream(this.currentStream);

            // 3. Start actual streaming (Provider specific)
            await this.startProviderStream(streamId);

            return this.currentStream;
        } catch (error) {
            console.error('Failed to start broadcast:', error);
            this.isBroadcasting = false;
            throw error;
        }
    }

    // Stop a broadcast
    async stopBroadcast(): Promise<void> {
        if (!this.currentStream) return;

        try {
            console.log('Stopping broadcast');

            // 1. Stop provider stream
            await this.stopProviderStream();

            // 2. Notify socket server
            socketClient.endStream(this.currentStream.id);

            // 3. Update local state
            this.currentStream.status = 'ended';
            this.currentStream.endedAt = new Date().toISOString();
            this.isBroadcasting = false;
            this.currentStream = null;

        } catch (error) {
            console.error('Failed to stop broadcast:', error);
            throw error;
        }
    }

    // Provider specific implementations
    private async startProviderStream(streamId: string): Promise<void> {
        switch (this.provider) {
            case 'agora':
                // await AgoraRtcEngine.joinChannel(...)
                break;
            case 'aws-ivs':
                // await IVSBroadcastClient.start(...)
                break;
            case 'mux':
                // Start RTMP stream to Mux ingest URL
                break;
            case 'mock':
            default:
                console.log('Mock stream started');
                break;
        }
    }

    private async stopProviderStream(): Promise<void> {
        switch (this.provider) {
            case 'agora':
                // await AgoraRtcEngine.leaveChannel()
                break;
            case 'aws-ivs':
                // await IVSBroadcastClient.stop()
                break;
            case 'mock':
            default:
                console.log('Mock stream stopped');
                break;
        }
    }

    // Helper to get playback URL based on provider
    private getPlaybackUrl(streamId: string): string {
        switch (this.provider) {
            case 'mux':
                return `https://stream.mux.com/${STREAMING_CONFIG.mux.tokenId}.m3u8`; // Example
            case 'aws-ivs':
                return `https://ivs.aws.com/${streamId}.m3u8`; // Example
            case 'mock':
            default:
                // Return a sample HLS stream for testing
                return 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';
        }
    }

    // Get current stream state
    getCurrentStream(): StreamState | null {
        return this.currentStream;
    }

    // Check if currently broadcasting
    isLive(): boolean {
        return this.isBroadcasting;
    }
}

export const streamService = new StreamService();
