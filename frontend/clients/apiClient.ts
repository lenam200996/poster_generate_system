import { Configuration } from "@/openapi/configuration"
import {
  ProjectsApiFactory,
  DocumentTemplatesApiFactory,
  DocumentBoastStampsApiFactory,
  DocumentEvaluationsApiFactory,
  DocumentFillersApiFactory,
  DocumentHeadLinesApiFactory,
  DocumentMyStocksApiFactory,
  ThumbIndexApiFactory,
  ConvertsApiFactory,
  BookletsApiFactory,
  DocumentsApiFactory,
  DocumentPartsApiFactory,
  MarginBottomApiFactory,
  SettingsApiFactory,
  ImportsApiFactory,
  PagesApiFactory,
  AuthorizesApiFactory,
  PriceTableApiFactory,
  ExportsApiFactory,
  IdmlReplaceApiFactory,
  HotelApiFactory,
  ReviewSummaryApiFactory,
} from "@/openapi/api"

export class ApiClient {
  private config = new Configuration({
    basePath: `${process.env.NEXT_PUBLIC_API_URL}` || "http://localhost:4000",
    // basePath: "https://yukichi-dev.test.formalproof.com",
  })
  public bookletApiFactory = BookletsApiFactory(this.config)
  public projectsApiFactory = ProjectsApiFactory(this.config)
  public documentMyStocksApi = DocumentMyStocksApiFactory(this.config)
  public documentTemplatesApiFactory = DocumentTemplatesApiFactory(this.config)
  public documentBoastStampsApi = DocumentBoastStampsApiFactory(this.config)
  public documentEvaluationsApi = DocumentEvaluationsApiFactory(this.config)
  public documentFillersApi = DocumentFillersApiFactory(this.config)
  public documentHeadLinesApi = DocumentHeadLinesApiFactory(this.config)
  public thumbIndexApi = ThumbIndexApiFactory(this.config)
  public convertsApi = ConvertsApiFactory(this.config)
  public documentsApiFactory = DocumentsApiFactory(this.config)
  public documentPartsApi = DocumentPartsApiFactory(this.config)
  public marginBottomApi = MarginBottomApiFactory(this.config)
  public settingsApiFactory = SettingsApiFactory(this.config)
  public importsApi = ImportsApiFactory(this.config)
  public pagesApiFactory = PagesApiFactory(this.config)
  public authorizesApiFactory = AuthorizesApiFactory(this.config)
  public priceTableApiFactory = PriceTableApiFactory(this.config)
  public idmlReplaceApiFactory = IdmlReplaceApiFactory(this.config)
  public hotelApiFactory = HotelApiFactory(this.config)
  public exportsApi = ExportsApiFactory(this.config)
  public reviewSummaryApi = ReviewSummaryApiFactory(this.config)
}
