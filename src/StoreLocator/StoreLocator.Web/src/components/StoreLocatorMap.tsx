import React from 'react';
import * as atlas from 'azure-maps-control';
import { ExitRequestMapInfo, ExitCountResponse } from '../models/ExitRequest';
import apiClient from '../services/ApiClient';
import config from '../appConfig.json';
import authProvider from '../providers/authProvider';
import  { AuthenticationState } from 'react-aad-msal'
import StoresAggregateCard from './StoresAggregateCard';
import { UserContext, UserContextType } from '../providers/UserContext';

export interface ExitRequestHeatMapState {
    exitRequests: ExitRequestMapInfo[],
    exitCounts?: ExitCountResponse
}

export default class StoreLocatorMap extends React.Component<{}, ExitRequestHeatMapState> {

    private map: atlas.Map | null = null;    
    private source: atlas.source.DataSource = new atlas.source.DataSource("heatmap", { });

    constructor(props: {}) {
        super(props);
        this.state = { 
          exitRequests: []
        };
    }  

    initHeatMap = () => {
      // Fetching exit requests
      apiClient.getExitRequestsForMap()
        .then(requests => {
          console.log('Received requests', requests);
          this.setState({ exitRequests: requests })
        })
        .catch(console.error);
      

      // Fetching exit request aggregations
      apiClient.getExitCount()
        .then(exitCountResponse => {
          console.log('Received counts', exitCountResponse);
          this.setState({ exitCounts: exitCountResponse });
        })
        .catch(console.error);
    }

    componentWillMount() {
      document.getElementsByTagName('html')[0].classList.add('fullscreen');
    }
    
    componentWillUnmount() {
      document.getElementsByTagName('html')[0].classList.remove('fullscreen');
    }

    componentWillUpdate(nextProps: {}, nextState: ExitRequestHeatMapState) {
      console.log('NextState', nextState);

      if (nextState.exitRequests !== this.state.exitRequests) {        
        this.source.clear();
        if (nextState.exitRequests != null) {
          var shapes = nextState.exitRequests
            .filter(item => !!item.coordinates)
            .map(item => {
              var position = new atlas.data.Position(item.coordinates[0], item.coordinates[1]);              
              var shape = new atlas.Shape(new atlas.data.Point(position));
              return shape;
            });

          this.source.add(shapes);
        }
      }
    }

    componentDidMount() {
      this.initHeatMap();
      let map = new atlas.Map("map", {
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: config.mapsKey
        },
        showFeedbackLink: false,
        center: [23.720539, 37.993810],
        zoom: 8
      });
      
      //Wait until the map resources are ready.
      map.events.add('ready', () => {
          /* Construct a zoom control*/
          map.controls.add(new atlas.control.ZoomControl(), {
            position: atlas.ControlPosition.BottomRight
          });
          
          map.sources.add(this.source);
          //map.layers.add(new atlas.layer.SymbolLayer(this.source));
          map.layers.add(new atlas.layer.HeatMapLayer(this.source, "heatmaplayer", { radius:10, opacity:0.8 }));          
      });

      this.map = map;      
    }

    render() {
        return (
          <React.Fragment>
            <div id="map"></div>
            <StoresAggregateCard exitAggregate={this.state.exitCounts} />
          </React.Fragment>
        );
    }
}