#!/usr/bin/env node

/**
 * @author youngoat@163.com
 * @create 2020-11-23
 */

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , fs = require('fs')
    , os = require('os')
    , path = require('path')
    
    /* NPM */
    , commandos = require('commandos')
    , qir = require('qir/syncing')

    /* in-package */
    ;

const options = commandos.parse(require('./options'));

if (options.help) {
    commandos.man(fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8'));
    return;
}

const LINKEE_JSON_PATH = '.linkee.json';
function load() {
    if (fs.existsSync(LINKEE_JSON_PATH)) {
        let linkee = JSON.parse(fs.readFileSync(LINKEE_JSON_PATH, 'utf8'));
        for (let name in linkee) {
            if (linkee[name].startsWith('~/')) {
                linkee[name] = os.homedir() + linkee[name].slice(1);
            }
        }
        return linkee;
    }
    else {
        return {};
    }
}

function save(linkee) {
    for (let name in linkee) {
        let homedir = os.homedir();
        if (linkee[name].startsWith(homedir + '/')) {
            linkee[name] = '~' + linkee[name].slice(homedir.length);
        }
    }

    let sorted = {};
    Object.keys(linkee).sort().forEach(name => sorted[name] = linkee[name]);
    fs.writeFileSync(LINKEE_JSON_PATH, JSON.stringify(sorted, null, 4));
}

function apply(origin, name) {
    /**
     * @TODO 判断项目是否已经建立并且匹配。
     */
    if (fs.existsSync(origin)) {
        console.warn(`File or directory "${origin}" already exists.`);
        return;
    }

    qir.symlink(name, origin);
    return true;
}

function reset(origin, name) {
    /**
     * @TODO 判断项目是否已经建立并且匹配。
     */

    if (fs.existsSync(origin)) {
        fs.unlinkSync(origin);
    }

    fs.renameSync(name, origin);
    return true;
}

function link(origin, name) {
    /**
     * @TODO 判断项目是否已经建立并且匹配。
     */

    if (fs.existsSync(name)) {
        console.warn(`File or directory "${name}" already exists.`);
        return;
    }

    if (!fs.existsSync(origin)) {
        console.warn(`File or directory "${origin}" not found.`);
        return;
    }

    let stats = fs.statSync(origin);
    if (!stats.isFile() && !stats.isDirectory()) {
        console.warn(`"${origin}" SHOULD be a file or directory.`);
        return;
    }

    qir.rename(origin, name);
    qir.symlink(name, origin);
    return true;
}

function main() {
    let linkee = load();

    if (options.list) {
        for (let name in linkee) {
            console.log(`${linkee[name]} -> ${name}`);
        }
        return;
    }

    if (options.apply) {
        if (typeof options.apply == 'boolean') {
            for (let name in linkee) {
                let origin = linkee[name];
                apply(origin, name);
            }
        }
        else {
            let name = options.apply;
            let origin = linkee[name];
            apply(origin, name);
        }
    }
    else if (options.reset) {
        if (typeof options.reset == 'boolean') {
            for (let name in linkee) {
                let origin = linkee[name];
                if (reset(origin, name)) {
                    delete linkee[name];
                }
            }
        }
        else {
            let name = options.reset;
            let origin = linkee[name];
            if (!origin) {
                console.warn(`Item "${name}" not saved.`);
                return;
            }

            if (reset(origin, name)) {
                delete linkee[name];
            }
        }
    }
    else {
        let { origin, name } = options;
        if (!origin) {
            console.warn('--origin <ORIGINAL_NAME> is required.');
            return;
        }
        if (!name) {
            name = path.basename(origin);
        }
        if (link(origin, name)) {
            linkee[name] = origin;
        }
    }

    save(linkee);
}

main();

