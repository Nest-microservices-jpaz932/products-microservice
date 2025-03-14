import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @MessagePattern('products.create')
    create(@Payload() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @MessagePattern('products.findAll')
    findAll(@Payload() paginationDto: PaginationDto) {
        return this.productsService.findAll(paginationDto);
    }

    @MessagePattern('products.findOne')
    findOne(@Payload('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @MessagePattern('products.update')
    update(@Payload() updateProductDto: UpdateProductDto) {
        return this.productsService.update(
            updateProductDto.id,
            updateProductDto,
        );
    }

    @MessagePattern('products.delete')
    remove(@Payload('id') id: string) {
        return this.productsService.remove(+id);
    }

    @MessagePattern('products.validate')
    validateProducts(@Payload() ids: number[]) {
        return this.productsService.validateProducts(ids);
    }
}
