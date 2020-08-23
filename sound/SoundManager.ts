import { Howler } from "howler";
import { DataManager } from "../data";
import { EventManager } from "../engine";
import { Asserts, IJSONObject, JSONUtil } from "../util";
import { SoundGroup } from "./SoundGroup";

export class SoundManager
{
	private readonly groups: Map< string, SoundGroup >;

	/**
	 *
	 */
	public constructor()
	{
		this.groups = new Map< string, SoundGroup >();
	}

	/**
	 *
	 */
	public Init( data: IJSONObject, server: string, dataManager: DataManager, eventManager: EventManager )
	{
		const config = JSONUtil.AsType< ISoundManagerConfig >( data );

		Object.keys( config.Groups ).forEach( ( id: string ) =>
		{
			const groupConfig = config.Groups[ id ] as IJSONObject;
			Asserts.AssertNotNull( groupConfig, "Group config not defined: " + id );
			this.groups.set( id, SoundGroup.FromConfig( groupConfig, server, dataManager, eventManager ) );
		} );

		const muteRead = dataManager.GetRead( "Value", "Sound:Mute" );
		const muteWrite = dataManager.GetWrite( "Value", "Sound:Mute" );
		eventManager.Subscribe( "Sound:ToggleMute", () =>
		{
			const mute = ( muteRead.Get() === 0 ? true : false );
			Howler.mute( mute );
			muteWrite.Set( mute ? 1 : 0 );
		} );

		eventManager.Subscribe( "Document:Hidden", () => this.Pause() );
		eventManager.Subscribe( "Document:Visible", () => this.Resume() );
	}

	public Pause(): void
	{
		this.groups.forEach( ( group ) => group.Pause() );
	}

	public Resume(): void
	{
		this.groups.forEach( ( group ) => group.Resume() );
	}
}

interface ISoundManagerConfig
{
	Groups: IJSONObject;
}
