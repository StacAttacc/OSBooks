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
            mysql80
            git
          ];

          DOTNET_ROOT = "${pkgs.dotnet-sdk_9}";
          NUGET_PACKAGES = "${toString ./.}/.nuget/packages";
          MYSQL_BASEDIR = "${pkgs.mysql80}";

          shellHook = ''
            export MYSQL_HOME=$PWD/.mysql
            export MYSQL_DATADIR=$MYSQL_HOME/data
            export MYSQL_UNIX_PORT=$MYSQL_HOME/mysql.sock
            export MYSQL_PID_FILE=$MYSQL_HOME/mysql.pid

            if [ ! -d "$MYSQL_DATADIR" ]; then
              mkdir -p "$MYSQL_DATADIR"
              mysqld --initialize-insecure \
                --basedir="$MYSQL_BASEDIR" \
                --datadir="$MYSQL_DATADIR" \
                --log-error="$MYSQL_HOME/init.log"
            fi

            if ! mysqladmin --socket="$MYSQL_UNIX_PORT" ping --silent 2>/dev/null; then
              mysqld \
                --basedir="$MYSQL_BASEDIR" \
                --datadir="$MYSQL_DATADIR" \
                --socket="$MYSQL_UNIX_PORT" \
                --pid-file="$MYSQL_PID_FILE" \
                --log-error="$MYSQL_HOME/mysql.log" \
                --port=3306 &

              echo -n "  waiting for MySQL"
              until mysqladmin --socket="$MYSQL_UNIX_PORT" ping --silent 2>/dev/null; do
                echo -n "."
                sleep 0.3
              done
              echo " ready"
            fi

            echo ""
            echo "  dotnet : $(dotnet --version)"
            echo "  node   : $(node --version)"
            echo "  ng     : $(ng version --skip-confirmation 2>/dev/null | grep 'Angular CLI' | awk '{print $NF}')"
            echo "  mysql  : $(mysql --version | awk '{print $3}')"
            echo ""
            echo "  connect: mysql --socket=$MYSQL_UNIX_PORT"
            echo ""
          '';
        };
      });
}
