import { turtle } from '@tpluscode/rdf-string'
import { hydra, schema, rdf, rdfs, dcterms, xsd } from '@tpluscode/rdf-ns-builders'
import toStream from 'string-to-stream'
import { wba, wbo } from '@wikibus/core/namespace'

export default (baseUri: string) => toStream(turtle`
<> {
    <> a ${hydra.Resource}, ${wba.EntryPoint} ;
        ${hydra.title} "wikibus.org library" ;
        ${hydra.description} "Here you can explore the private collection of books and other physical and electronic media about public transport" ;
        ${schema.hasPart} <https://cms.wikibus.org/contributing/brochures> ;
        ${wba.brochures} <brochures> ;
        ${wba.books} <books> ;
        ${wba.magazines} <magazines> ;
        ${wba.wishlist} <wishlist> ;
}

<magazines> {
    <magazines> a ${hydra.Collection}, ${wba.MagazineCollection} ;
        ${rdfs.label} "Magazine collection" ;
        ${hydra.description} "Periodicals such as weekly/monthly magazines as well as yearly catalogs" ;
        ${hydra.manages} [
            ${hydra.property} ${rdf.type} ;
            ${hydra.object} ${schema.Periodical}
        ] ;
        ${hydra.search} [
            a ${hydra.IriTemplate} ;
            ${hydra.mapping} [
                a ${hydra.IriTemplateMapping} ;
                ${hydra.property} ${dcterms.title} ;
                ${hydra.required} false ;
                ${hydra.variable} "title" ;
            ] ;
            ${hydra.template} "${baseUri}magazines{?page,title}" ;
            ${hydra.variableRepresentation} ${hydra.BasicRepresentation} 
        ]
}

<books> {
  <books> a ${hydra.Collection}, ${wba.BookCollection} ;
    ${hydra.manages} [
        ${hydra.property} ${rdf.type} ;
        ${hydra.object} ${wbo.Book}
    ] ;
    ${rdfs.label} "Book collection" ;
    ${hydra.search} [
      a ${hydra.IriTemplate} ;
      ${hydra.mapping} [
        a ${hydra.IriTemplateMapping} ;
        ${hydra.property} ${dcterms.title} ;
        ${hydra.required} false ;
        ${hydra.variable} "title" ;
      ] , [
        a ${hydra.IriTemplateMapping} ;
        ${hydra.property} ${schema.author} ;
        ${hydra.required} false ;
        ${hydra.variable} "author" ;
      ] , [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${dcterms.language} ;
            ${hydra.required} false ;
            ${hydra.variable} "language" ;
        ];
      ${hydra.template} "${baseUri}books{?page,title,author,language}" ;
      ${hydra.variableRepresentation} ${hydra.BasicRepresentation} 
    ]
}

<brochures> {
  <brochures> a ${hydra.Collection}, ${wba.BrochureCollection} ;
    ${hydra.manages} [
        ${hydra.property} ${rdf.type} ;
        ${hydra.object} ${wbo.Brochure}
    ] ;
    ${rdfs.label} "Public transport brochure collection" ;
    ${hydra.search} [
        a ${hydra.IriTemplate} ;
        ${hydra.mapping} [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${dcterms.title} ;
            ${hydra.required} false ;
            ${hydra.variable} "title" ;
        ] , [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${wba.withPdfOnly} ;
            ${hydra.required} false ;
            ${hydra.variable} "withPdfOnly" ;
        ] , [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${wba.withoutImages} ;
            ${hydra.required} false ;
            ${hydra.variable} "withoutImages" ;
        ] , [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${schema.contributor} ;
            ${hydra.required} false ;
            ${hydra.variable} "contributor" ;
        ] , [
            a ${hydra.IriTemplateMapping} ;
            ${hydra.property} ${dcterms.language} ;
            ${hydra.required} false ;
            ${hydra.variable} "language" ;
        ] ;
        ${hydra.template} "${baseUri}brochures{?page,title,withPdfOnly,withoutImages,contributor,language}" ;
        ${hydra.variableRepresentation} ${hydra.BasicRepresentation} 
    ] .

  ${wba.withPdfOnly} ${rdfs.range} ${xsd.boolean} .
  ${wba.withoutImages} ${rdfs.range} ${xsd.boolean} .
}

<wishlist> {
  <wishlist> a ${wba.Wishlist}, ${schema.WebPageElement} ;
    ${rdfs.label} "Build your own wishlist" ;
    ${schema.hasPart} <https://cms.wikibus.org/wishlist/about> ;
  .
}
`.toString())
