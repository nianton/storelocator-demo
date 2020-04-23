using System;
using System.Collections.Generic;
using System.Text;

namespace StoreLocator.Domain
{
    public class StoreQueryRequest
    {
        public string Amenity { get; set; }
    }

    public class StoreDistanceQueryRequest : StoreQueryRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int Distance { get; set; }
    }

    public class StoreAreaQueryRequest : StoreQueryRequest
    {
        public double NwLatitude { get; set; }
        public double NwLongitude { get; set; }
        public double SeLatitude { get; set; }
        public double SeLongitude { get; set; }
        public int Distance { get; set; }
    }
}