import { ApplicationInsights, Snippet } from '@microsoft/applicationinsights-web'
import config from '../appConfig.json';

const snippet: Snippet = {
 config: {
   instrumentationKey: config.appInsightsInstrumentationKey   
 }
};

const appInsights = new ApplicationInsights(snippet);
export default appInsights;