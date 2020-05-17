import { EventManager } from "../engine";
import { PromiseUtil } from "./PromiseUtil";

export class Utils
{
	public static Init( eventManager: EventManager ): void
	{
		PromiseUtil.Init( eventManager );
	}
}
