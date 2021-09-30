using System;
using Xunit;

namespace StoreLocator.ApiFunc.Tests
{
    public class UnitTest1
    {
        const string ExpectedGreeting = "HelloDevOps";

        [Fact]
        public void Test1()
        {
            Assert.Equal("HelloDevOps", ExpectedGreeting);
        }
    }
}
