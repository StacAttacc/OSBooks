{
  description = "Angular frontend + .NET backend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            dotnet-sdk_9
            nodejs_22
            nodePackages."@angular/cli"
            git
          ];

          DOTNET_ROOT = "${pkgs.dotnet-sdk_9}";
          NUGET_PACKAGES = "${toString ./.}/.nuget/packages";

          shellHook = ''
            echo ""
            echo "  dotnet : $(dotnet --version)"
            echo "  node   : $(node --version)"
            echo "  npm    : $(npm --version)"
            echo "  ng     : $(ng version --skip-confirmation 2>/dev/null | grep 'Angular CLI' | awk '{print $NF}')"
            echo ""
          '';
        };
      });
}
