import React from 'react';
import * as atlas from 'azure-maps-control';
import StoreInfo from '../models/StoreInfo';
import { PosTypeStoreCount } from '../models/Store';
import apiClient from '../services/ApiClient';
import config from '../appConfig.json';
import authProvider from '../providers/authProvider';
import StoresAggregateCard from './StoresAggregateCard';
import { UserContext, UserContextType } from '../providers/UserContext';

export interface MapViewState {
  stores: StoreInfo[],
  posTypeStoreCounts?: PosTypeStoreCount[]
}

export default class StoreLocatorMap extends React.Component<{}, MapViewState> {

  private map: atlas.Map | null = null;
  private source: atlas.source.DataSource = new atlas.source.DataSource("heatmap", { 
    cluster: true, 
    clusterRadius: 30, 
    clusterMaxZoom: 13 
  });

  constructor(props: {}) {
    super(props);
    this.state = {
      stores: []
    };
  }

  initHeatMap = () => {
    // Fetching exit requests
    apiClient.getStoreInfos()
      .then(requests => {
        console.log('Received stores', requests);
        this.setState({ stores: requests })
      })
      .catch(console.error);

    // Fetching exit request aggregations
    apiClient.getPosTypeCounts()
      .then(posTypeStoreCounts => {
        console.log('Received counts', posTypeStoreCounts);
        this.setState({ posTypeStoreCounts: posTypeStoreCounts });
      })
      .catch(console.error);
  }

  componentWillMount() {
    document.getElementsByTagName('html')[0].classList.add('fullscreen');
  }

  componentWillUnmount() {
    document.getElementsByTagName('html')[0].classList.remove('fullscreen');
  }

  componentWillUpdate(nextProps: {}, nextState: MapViewState) {
    console.log('NextState', nextState);

    if (nextState.stores !== this.state.stores) {
      this.source.clear();
      if (nextState.stores != null) {
        var shapes = nextState.stores
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
      
      map.controls.add(new atlas.control.ZoomControl(), {
        position: atlas.ControlPosition.BottomRight
      });

      map.sources.add(this.source);
      
      let clusterBubbleLayer = new atlas.layer.BubbleLayer(this.source, 'bubblelayer', {
        radius: 20,
        color: '#ED217C',
        strokeWidth: 0,
        filter: ['has', 'point_count'] //Only rendered data points which have a point_count property, which clusters do.
      });
      map.layers.add(clusterBubbleLayer);

      let countLayer = new atlas.layer.SymbolLayer(this.source, 'countLayer', {
        iconOptions: {
          image: 'none' //Hide the icon image.
        },
        textOptions: {
          textField: ['get', 'point_count_abbreviated'],
          offset: [0, 0.4],
          color: 'white'
        }
      });
      map.layers.add(countLayer);

      let symbolLayer = new atlas.layer.SymbolLayer(this.source, 'symbLayer', {
        filter: ['!', ['has', 'point_count']] //Filter out clustered points from this layer.
      });
      map.layers.add(symbolLayer);
    });

    this.map = map;
  }

  render() {
    return (
      <React.Fragment>
        <div id="map"></div>
        <StoresAggregateCard storeCounts={this.state.posTypeStoreCounts} />
      </React.Fragment>
    );
  }
}