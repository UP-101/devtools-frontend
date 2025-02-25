// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Common from '../../../../../front_end/core/common/common.js';
import type * as Platform from '../../../../../front_end/core/platform/platform.js';
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import * as Protocol from '../../../../../front_end/generated/protocol.js';
import * as Network from '../../../../../front_end/panels/network/network.js';
import {assertElement} from '../../helpers/DOMHelpers.js';
import {describeWithEnvironment} from '../../helpers/EnvironmentHelpers.js';

describeWithEnvironment('NetworkLogView', () => {
  it('adds marker to requests with overridden headers', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.responseHeaders = [{name: 'foo', value: 'overridden'}];
    request.originalResponseHeaders = [{name: 'foo', value: 'original'}];

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'name');
    const marker = el.querySelector('.network-override-marker');
    const tooltip = el.querySelector('[title="Request headers are overridden"]');
    assertElement(marker, HTMLDivElement);
    assert.isNotNull(tooltip);
  });

  it('adds marker to requests with overridden content', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.hasOverriddenContent = true;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'name');
    const marker = el.querySelector('.network-override-marker');
    const tooltip = el.querySelector('[title="Request content is overridden"]');
    assertElement(marker, HTMLDivElement);
    assert.isNotNull(tooltip);
  });

  it('adds marker to requests with overridden headers and content', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.hasOverriddenContent = true;
    request.responseHeaders = [{name: 'foo', value: 'overridden'}];
    request.originalResponseHeaders = [{name: 'foo', value: 'original'}];

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'name');
    const marker = el.querySelector('.network-override-marker');
    const tooltip = el.querySelector('[title="Both request content and headers are overridden"]');
    assertElement(marker, HTMLDivElement);
    assert.isNotNull(tooltip);
  });

  it('does not add marker to unoverridden request', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'name');
    const marker = el.querySelector('.network-override-marker');
    assert.isNull(marker);
  });

  it('adds an error red icon to the left of the failed requests', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 404;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('cross-circle-filled.svg")', iconImage);

    const backgroundColorOfIcon = iconStyle.backgroundColor.toString();
    assert.strictEqual(backgroundColorOfIcon, 'var(--icon-error)');
  });

  it('show media icon', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/test.mp3' as Platform.DevToolsPath.UrlString, '' as Platform.DevToolsPath.UrlString,
        null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Media);
    request.mimeType = 'audio/mpeg' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-media.svg")', iconImage);
  });

  it('show wasm icon', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/test.wasm' as Platform.DevToolsPath.UrlString, '' as Platform.DevToolsPath.UrlString,
        null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Wasm);
    request.mimeType = 'application/wasm' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-wasm.svg")', iconImage);
  });

  it('show websocket icon', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com/ws' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.WebSocket);
    request.mimeType = '' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-websocket.svg")', iconImage);
  });

  it('shows fetch icon', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/test.json?keepalive=false' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Fetch);
    request.mimeType = '' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-fetch-xhr.svg")', iconImage);
  });

  it('shows xhr icon', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/test.json?keepalive=false' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.XHR);
    request.mimeType = 'application/octet-stream' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-fetch-xhr.svg")', iconImage);
  });

  it('mime win: show image preview icon for xhr-image', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/test.svg' as Platform.DevToolsPath.UrlString, '' as Platform.DevToolsPath.UrlString,
        null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.XHR);
    request.mimeType = 'image/svg+xml' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon.image') as HTMLElement;
    const imagePreview = el.querySelector('.image-network-icon-preview') as HTMLImageElement;

    assert.isTrue(iconElement instanceof HTMLDivElement);
    assert.isTrue(imagePreview instanceof HTMLImageElement);
  });

  it('mime win: show document icon for fetch-html', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com/page' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Fetch);
    request.mimeType = 'text/html' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-document.svg")', iconImage);
  });

  it('mime win: show generic icon for preflight-text', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/api/test' as Platform.DevToolsPath.UrlString, '' as Platform.DevToolsPath.UrlString,
        null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Preflight);
    request.mimeType = 'text/plain' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-generic.svg")', iconImage);
  });

  it('mime win: show script icon for other-javascript)', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com/ping' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Other);
    request.mimeType = 'application/javascript' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-script.svg")', iconImage);
  });

  it('mime win: shows json icon for fetch-json', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId,
        'https://www.example.com/api/list' as Platform.DevToolsPath.UrlString, '' as Platform.DevToolsPath.UrlString,
        null, null, null);
    request.setResourceType(Common.ResourceType.resourceTypes.Fetch);
    request.mimeType = 'application/json' as SDK.NetworkRequest.MIME_TYPE;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'name');
    const iconElement = el.querySelector('.icon') as HTMLElement;

    const iconStyle = iconElement.style;
    const indexOfIconImage = iconStyle.webkitMaskImage.indexOf('Images/') + 7;
    const iconImage = iconStyle.webkitMaskImage.substring(indexOfIconImage);

    assert.strictEqual('file-json.svg")', iconImage);
  });

  it('shows the corresponding status text of a status code', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 305;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');

    networkRequestNode.renderCell(el, 'status');

    assert.strictEqual(el.title, '305 Use Proxy');
  });

  it('populate has-overrides: headers', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.responseHeaders = [{name: 'foo', value: 'overridden'}];
    request.originalResponseHeaders = [{name: 'foo', value: 'original'}];

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'has-overrides');
    const marker = el.innerText;
    assert.strictEqual(marker, 'headers');
  });

  it('populate has-overrides: content', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.hasOverriddenContent = true;

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'has-overrides');
    const marker = el.innerText;
    assert.strictEqual(marker, 'content');
  });

  it('populate has-overrides: content, headers', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(true);
    request.hasOverriddenContent = true;
    request.responseHeaders = [{name: 'foo', value: 'overridden'}];
    request.originalResponseHeaders = [{name: 'foo', value: 'original'}];

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'has-overrides');
    const marker = el.innerText;
    assert.strictEqual(marker, 'content, headers');
  });

  it('populate has-overrides: null', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.statusCode = 200;

    request.setWasIntercepted(false);

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'has-overrides');
    const marker = el.innerText;
    assert.strictEqual(marker, '');
  });

  it('only counts non-blocked response cookies', async () => {
    const request = SDK.NetworkRequest.NetworkRequest.create(
        'requestId' as Protocol.Network.RequestId, 'https://www.example.com' as Platform.DevToolsPath.UrlString,
        '' as Platform.DevToolsPath.UrlString, null, null, null);
    request.addExtraResponseInfo({
      responseHeaders:
          [{name: 'Set-Cookie', value: 'good=123; Path=/; Secure; SameSite=None\nbad=456; Path=/; SameSite=None'}],
      blockedResponseCookies: [{
        blockedReasons: [Protocol.Network.SetCookieBlockedReason.SameSiteNoneInsecure],
        cookie: null,
        cookieLine: 'bad=456; Path=/; SameSite=None',
      }],
      resourceIPAddressSpace: Protocol.Network.IPAddressSpace.Public,
      statusCode: undefined,
      cookiePartitionKey: undefined,
      cookiePartitionKeyOpaque: undefined,
    });

    const networkRequestNode = new Network.NetworkDataGridNode.NetworkRequestNode(
        {} as Network.NetworkDataGridNode.NetworkLogViewInterface, request);
    const el = document.createElement('div');
    networkRequestNode.renderCell(el, 'setcookies');
    assert.strictEqual(el.innerText, '1');
  });
});
