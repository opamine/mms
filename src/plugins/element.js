import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Header,
  Aside,
  Footer,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Row,
  Col,
  Alert,
  Tooltip,
  Dialog,
  Radio,
  RadioGroup,
  MessageBox,
  Pagination,
  Message,
  Select,
  Option,
  InputNumber,
  Divider,
  DatePicker,
  Timeline,
  TimelineItem,
  Tag
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Alert)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(InputNumber)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Tag)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
