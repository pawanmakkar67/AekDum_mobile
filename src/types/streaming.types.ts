// Streaming and Live Video Types

export type StreamProvider = 'agora' | 'aws-ivs' | 'mux' | 'mock';

export type StreamStatus = 'idle' | 'connecting' | 'live' | 'paused' | 'ended' | 'error';

export type StreamQuality = 'auto' | '1080p' | '720p' | '480p' | '360p';

// Stream Configuration
export interface StreamConfig {
    provider: StreamProvider;
    streamKey?: string;
    channelId?: string;
    playbackUrl?: string;
    lowLatency: boolean;
    quality: StreamQuality;
}

// Stream State
export interface StreamState {
    id: string;
    status: StreamStatus;
    title: string;
    description?: string;
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    viewerCount: number;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    thumbnailUrl?: string;
    playbackUrl?: string;
    chatEnabled: boolean;
    recordingEnabled: boolean;
}

// Video Player State
export interface VideoPlayerState {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    buffering: boolean;
    quality: StreamQuality;
    availableQualities: StreamQuality[];
    error?: string;
}

// HLS Configuration
export interface HLSConfig {
    enableLowLatency: boolean;
    maxBufferLength: number;
    maxMaxBufferLength: number;
    liveBackBufferLength: number;
    liveSyncDuration: number;
    liveMaxLatencyDuration: number;
    manifestLoadingTimeOut: number;
    manifestLoadingMaxRetry: number;
    manifestLoadingRetryDelay: number;
}

// WebRTC Configuration (for hosts)
export interface WebRTCConfig {
    iceServers: RTCIceServer[];
    videoCodec: 'VP8' | 'VP9' | 'H264';
    audioCodec: 'opus' | 'PCMU' | 'PCMA';
    videoBitrate: number;
    audioBitrate: number;
    frameRate: number;
    resolution: {
        width: number;
        height: number;
    };
}

// Stream Events
export type StreamEventType =
    | 'stream_started'
    | 'stream_ended'
    | 'viewer_joined'
    | 'viewer_left'
    | 'product_tagged'
    | 'product_pinned'
    | 'product_unpinned'
    | 'flash_deal_started'
    | 'flash_deal_ended'
    | 'inventory_updated'
    | 'chat_message'
    | 'reaction'
    | 'gift_sent';

export interface StreamEvent {
    type: StreamEventType;
    streamId: string;
    timestamp: number;
    data: any;
    userId?: string;
}

// Agora Specific Types
export interface AgoraConfig {
    appId: string;
    channel: string;
    token?: string;
    uid?: number;
    role: 'host' | 'audience';
}

export interface AgoraStreamStats {
    duration: number;
    txBytes: number;
    rxBytes: number;
    txKBitRate: number;
    rxKBitRate: number;
    txAudioKBitRate: number;
    rxAudioKBitRate: number;
    txVideoKBitRate: number;
    rxVideoKBitRate: number;
    users: number;
}

// AWS IVS Specific Types
export interface AWSIVSConfig {
    channelArn: string;
    playbackUrl: string;
    ingestEndpoint?: string;
    streamKey?: string;
}

export interface AWSIVSMetadata {
    channelArn: string;
    streamHealth: 'healthy' | 'starving' | 'unknown';
    viewerCount: number;
    startTime?: string;
}

// Mux Specific Types
export interface MuxConfig {
    playbackId: string;
    streamKey?: string;
    liveStreamId?: string;
}

export interface MuxStreamStats {
    liveStreamId: string;
    status: 'idle' | 'active' | 'disabled';
    currentViewers: number;
    maxViewers: number;
    streamDuration: number;
}

// Stream Analytics
export interface StreamAnalytics {
    streamId: string;
    totalViewers: number;
    peakViewers: number;
    averageWatchTime: number;
    totalWatchTime: number;
    chatMessages: number;
    reactions: number;
    productsTagged: number;
    productsSold: number;
    revenue: number;
    engagement: {
        likes: number;
        shares: number;
        comments: number;
    };
}

// Host Controls
export interface HostControls {
    canStartStream: boolean;
    canEndStream: boolean;
    canTagProducts: boolean;
    canPinProducts: boolean;
    canCreateFlashDeals: boolean;
    canModerateChat: boolean;
    canBlockUsers: boolean;
}

// Viewer Permissions
export interface ViewerPermissions {
    canChat: boolean;
    canReact: boolean;
    canSendGifts: boolean;
    canPurchase: boolean;
}
