function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return "div[role='region'].outlet" + shadowSelector + " {outline: none;}";
  /*LWC compiler v8.1.2*/
}
export default [stylesheet];