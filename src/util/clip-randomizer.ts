import { ApiClient, HelixClip, HelixUser } from '@twurple/api';
import { AppTokenAuthProvider, StaticAuthProvider } from '@twurple/auth';

export interface IClipFilter {
    filter(clips: HelixClip[]): HelixClip[];
}

export default class ClipRandomizer {
    twitchApi!: ApiClient;

    constructor(
        authentication: { clientId: string, accessToken: string } | { clientId: string, clientSecret: string },
        protected filters?: IClipFilter[],
    ) {
        let authProvider: StaticAuthProvider | AppTokenAuthProvider;

        if ('accessToken' in authentication) {
            authProvider = new StaticAuthProvider(authentication.clientId, authentication.accessToken);
        } else {
            authProvider = new AppTokenAuthProvider(authentication.clientId, authentication.clientSecret);
        }

        this.twitchApi = new ApiClient({authProvider: authProvider});
    }

    protected getClips = async (streamer: HelixUser): Promise<HelixClip[]> => {
        const clips = await this.twitchApi.clips.getClipsForBroadcaster(streamer.id, {limit: 100});

        return clips.data;
    }

    public getRandomClip = async (streamer: HelixUser): Promise<HelixClip> => {
        let clips = await this.getClips(streamer);

        this.filters?.forEach(clipFilter => clips = clipFilter.filter(clips));

        return clips[Math.floor(Math.random() * clips.length)];
    }

    public getUsers = async (streamers: string[]): Promise<HelixUser[]> => await this.twitchApi.users.getUsersByNames(streamers)
}
