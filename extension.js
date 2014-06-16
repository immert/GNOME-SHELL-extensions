const Lang = imports.lang;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const AppFavorites = imports.ui.appFavorites;
const Main = imports.ui.main;

const mTaskBar = new Lang.Class({
    Name: 'mTaskBar',
    _iconSize: 48,
    _init: function() {
        this._container = new St.BoxLayout({ style_class: "tkb-box"});
        this._boxArray = new Array();
        for(let n = 0; n < global.screen.n_workspaces; n++) {
            let box = new St.BoxLayout({ style_class: "tkb-box"});
            let favApps = this._getFavoritesApp();
            for(let f in favApps) {
                let btnFav = new St.Button({ style_class: "tkb-task-button", child: favApps[f].create_icon_texture(this._iconSize)});
                box.add_actor(btnFav);
            }
            this._boxArray.push(box);
            this._container.add_actor(this._boxArray[n]);
        }
        Main.panel._leftBox.insert_child_at_index(this._container, 1);
        this._onWorkspaceChanged();

        this._appSystem = Shell.AppSystem.get_default();
        this._installedChangedSIG = this._appSystem.connect('installed-Changed', Lang.bind(this, this._favoritesChanged));
        this._changedSIG = this._appSystem.connect('changed', Lang.bind(this, this._favoritesChanged));
        this._nWorkspacesSIG = global.screen.connect('notify::n-workspaces', Lang.bind(this, this._onWorkspaceChanged));

    },

    _getFavoritesApp: function() {
       return AppFavorites.getAppFavorites().getFavorites();
    },

    _favoritesChanged: function() {
    
    },

    _onWorkspaceChanged: function() {
        let s = global.screen.get_active_workspace().index();
        for(let i in this._boxArray) {
            if(i != s) this._boxArray[i].hide();
        }
        this._boxArray[s].show();
    },

    
    
    destroy: function() {
        this._appSystem.disconnect(this._installedChangedSIG);
        this._appSystem.disconnect(this._changedSIG);
        global.screen.disconnect(this._nWorkspacesSIG);
    }
});

let tskBAR;
function init() {}
function enable() {tskBAR = new mTaskBar();}
function disable() {}

