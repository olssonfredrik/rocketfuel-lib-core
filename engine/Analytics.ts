import { ApplicationInsights } from "@microsoft/applicationinsights-web";

export class Analytics
{
	private readonly insight: ApplicationInsights | undefined;

	public constructor( key?: string )
	{
		if( !!key && key.length > 0 )
		{
			this.insight = new ApplicationInsights( { config: { instrumentationKey: key } } );
			this.insight.loadAppInsights();
		}
	}
}
