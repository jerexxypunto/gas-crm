function doGet(e) {

  // Intentamos obtener la ruta desde 'pathInfo' (ej: /usuarios) 
  // o desde el parámetro 'route' (ej: ?route=usuarios)
  var raw = (e && e.pathInfo) || (e && e.parameter && e.parameter.route);

  // Limpiamos el string: removemos caracteres especiales y posibles slashes iniciales
  var route = raw ? String(raw).replace(/^\/+/, "").replace(/[^a-zA-Z0-9_-]/g, "") : "";

  // Si sigue vacío, asignamos el default
  if (!route) route = "index";

   try {
    return HtmlService.createTemplateFromFile(route)
      .evaluate()
      .setTitle("GSC CRM")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createTemplateFromFile("index")
      .evaluate()
      .setTitle("GSC CRM")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getPageUrl(){
  return ScriptApp.getService().getUrl();
}
