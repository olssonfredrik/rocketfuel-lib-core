import { CursorState } from "./CursorState";

export class Cursor
{
	private current: CursorState;
	private element: HTMLCanvasElement;

	/**
	 * Creates an instance of Cursor.
	 */
	public constructor( element: HTMLCanvasElement )
	{
		this.current = CursorState.Default;
		this.element = element;
	}

	/**
	 *
	 */
	public Get(): CursorState
	{
		return this.current;
	}

	/**
	 *
	 */
	public Set( cursor: CursorState ): void
	{
		if( cursor !== this.current )
		{
			this.element.style.cursor = cursor;
			this.current = cursor;
		}
	}
}
