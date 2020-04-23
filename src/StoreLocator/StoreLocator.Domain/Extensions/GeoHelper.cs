using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace StoreLocator.Domain.Extensions
{
    public static class GeoHelper
    {
        public static string AsPoint(this GeoLocation location)
        {
            return string.Format(
                    CultureInfo.InvariantCulture,
                    "POINT({0})",
                    location.AsCoordinates());
        }

        public static string AsPolygon(this GeoLocation northEast, GeoLocation southWest)
        {
            var northWest = new GeoLocation() { Type = "Point", Coordinates = new[] { northEast.Coordinates[0], southWest.Coordinates[1] } };
            var southEast = new GeoLocation() { Type = "Point", Coordinates = new[] { southWest.Coordinates[0], northEast.Coordinates[1] } };

            return string.Format(
                    CultureInfo.InvariantCulture,
                    "POLYGON(({0}, {1}, {2}, {3}, {4}))",
                    northEast.AsCoordinates(),
                    northWest.AsCoordinates(),
                    southWest.AsCoordinates(),
                    southEast.AsCoordinates(),
                    northEast.AsCoordinates());
        }

        private static string AsCoordinates(this GeoLocation location)
        {
            return string.Format(
                   CultureInfo.InvariantCulture,
                   "{0} {1}",
                   location.Coordinates[0],
                   location.Coordinates[1]);
        }
    }
}
