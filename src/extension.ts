'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { api } from './fceuxAutocomplete';
import * as _ from 'lodash';

const LUA_MODE: vscode.DocumentFilter = { language: 'lua', scheme: 'file' };

function getCompletionItemKind(item: string): vscode.CompletionItemKind {
    let kind: vscode.CompletionItemKind;
    switch (item) {
        case "func":
        case "function":
            kind = vscode.CompletionItemKind.Function;
            break;
        case "module":
            kind = vscode.CompletionItemKind.Module;
            break;
        default:
            throw "Invalid kind";
    }

    return kind;
}

function findSuggestions(text: string) {
    let words = text.trim().split('.');
    let targetKey = words.pop();
    let path = words.join(".children.");
    let parent;
    if (path != "") {
        path += ".children";
        parent = _.get(api, path);
    }
    else {
        parent = api;
    }

    let suggestions: vscode.CompletionItem[] = [];
    _.each(parent, (value, key) => {
        let item = new vscode.CompletionItem(key, getCompletionItemKind(value.type));
        if (_.get(value, "type") == "module") {
            item.detail = "FCEUX Module";
        }
        else {
            let returnType = _.get(value, "returns");
            let parameters = _.get(value, "parameters");
            var paramsArr = [];
            var paramsString = "";
            
            if (!parameters) {
                paramsString = "()";
            }
            else {
                _.each(parameters, (v, k) => {
                    paramsArr.push(`${k}: ${v.type}`);
                });
                paramsString = "(" + paramsArr.join(", ") + ")";
            }

            if (returnType) {
                paramsString += ` : ${returnType}`;
            }
            item.detail = paramsString;
        }
        item.documentation = _.get(value, "desc");
        suggestions.push(item);
    });

    return suggestions;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "fceux-autocomplete" is now active!');

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(LUA_MODE, {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.CompletionItem[] {
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            let suggestions = findSuggestions(lineTillCurrentPosition);
            

            
            // let suggestions: vscode.CompletionItem[] = [];
            // let newItem = new vscode.CompletionItem("turd", vscode.CompletionItemKind.Module);
            // newItem.detail = "TONYBALLS";
            // newItem.documentation = "TONY POOP BLAH BLAH";
            // suggestions.push(newItem);
            return suggestions;
        }
    }, '.'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}